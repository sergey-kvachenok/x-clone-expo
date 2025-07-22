import { postApi, useApiClient } from "@/utils/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Post, User } from "@/types"

export const usePosts = (currentUser?: User) => {
  const api = useApiClient()
  const queryClient = useQueryClient()

  const { data: postsData, isLoading, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postApi.getPosts(api),
    select: (response) => response.data.posts,
  })

  const { mutate: likePostMutation } = useMutation({
    mutationFn: (postId: string) => postApi.likePost(api, postId),
    
    // Optimistic update
    onMutate: async (postId: string) => {
      if (!currentUser) {
        return
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      // Snapshot the previous value - it's the full Axios response
      const previousResponse = queryClient.getQueryData(["posts"]) as any

      // Optimistically update to the new value
      queryClient.setQueryData(["posts"], (oldResponse: any) => {
        if (!oldResponse?.data?.posts) {
          return oldResponse
        }

        const oldPosts = oldResponse.data.posts as Post[]

        const updatedPosts = oldPosts.map(post => {
          if (post._id === postId) {
            const currentUserId = currentUser._id
            const isCurrentlyLiked = post.likes.includes(currentUserId)
            
            return {
              ...post,
              likes: isCurrentlyLiked 
                ? post.likes.filter((id: string) => id !== currentUserId) // Unlike
                : [...post.likes, currentUserId] // Like
            }
          }
          return post
        })

        // Return the full response structure with updated posts
        return {
          ...oldResponse,
          data: {
            ...oldResponse.data,
            posts: updatedPosts
          }
        }
      })

      // Return a context object with the snapshotted value
      return { previousResponse }
    },

    onError: (err, postId, context) => {
      if (context?.previousResponse) {
        queryClient.setQueryData(["posts"], context.previousResponse)
      }
    },

    onSuccess: (data, postId) => {
      // Success - data is already optimistically updated
    },

    // Always refetch after completion to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    }
  })

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  })
  
  const checkIsLiked = (postLikes: string[], currentUser: any) => {
    const isLiked = currentUser && postLikes.includes(currentUser._id);
    return isLiked;
  };

  const toggleLike = (postId: string) => {
    likePostMutation(postId)
  }

  return {
    posts: postsData || [],
    isLoading,
    error,
    refetch,
    toggleLike,
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    checkIsLiked,
  };
}
