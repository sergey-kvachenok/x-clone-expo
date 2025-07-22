import { postApi, useApiClient } from "@/utils/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Post, User, ApiResponse, PostsResponse } from "@/types"
import { togglePostLike } from "@/utils/cacheUtils"

export const usePosts = (currentUser?: User) => {
  const api = useApiClient()
  const queryClient = useQueryClient()

  const { data: postsData, isLoading, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postApi.getPosts(api),
    select: (response) => response.data.posts,
  })

  const { mutate: likePostMutation } = useMutation<
    unknown, 
    Error, 
    string, 
    { previousResponse?: ApiResponse<PostsResponse> }
  >({
    mutationFn: (postId: string) => postApi.likePost(api, postId),
    
    // Optimistic update
    onMutate: async (postId: string) => {
      if (!currentUser) {
        return
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      // Snapshot the previous value - it's the full Axios response
      const previousResponse = queryClient.getQueryData<ApiResponse<PostsResponse>>(["posts"])

      // Optimistically update (can't use utility due to different data structure)
      queryClient.setQueryData<ApiResponse<PostsResponse>>(["posts"], (oldResponse) => {
        if (!oldResponse?.data?.posts) return oldResponse
        
        const updatedPosts = oldResponse.data.posts.map((post: Post) => 
          post._id === postId ? togglePostLike(post, currentUser._id) : post
        )

        return {
          ...oldResponse,
          data: {
            ...oldResponse.data,
            posts: updatedPosts
          }
        }
      });

      // Return a context object with the snapshotted value
      return { previousResponse }
    },

    onError: (err: Error, postId: string, context) => {
      if (context?.previousResponse) {
        queryClient.setQueryData(["posts"], context.previousResponse)
      }
    },

    onSuccess: (data: unknown, postId: string) => {
      // Success - data is already optimistically updated
    },

    // Always refetch after completion to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    }
  })

  const deletePostMutation = useMutation<
    unknown,
    Error,
    string,
    { 
      previousPostsResponse?: ApiResponse<PostsResponse>;
      previousUserPostsResponse?: ApiResponse<PostsResponse>;
    }
  >({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),
    
    // Optimistic update for delete
    onMutate: async (postId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      await queryClient.cancelQueries({ queryKey: ["userPosts"] })

      // Snapshot the previous values
      const previousPostsResponse = queryClient.getQueryData<ApiResponse<PostsResponse>>(["posts"])
      const previousUserPostsResponse = queryClient.getQueryData<ApiResponse<PostsResponse>>(["userPosts"])

      // Optimistically remove the post from both caches
      queryClient.setQueryData<ApiResponse<PostsResponse>>(["posts"], (oldResponse) => {
        if (!oldResponse?.data?.posts) return oldResponse
        
        return {
          ...oldResponse,
          data: {
            ...oldResponse.data,
            posts: oldResponse.data.posts.filter((post: Post) => post._id !== postId)
          }
        }
      })

      // Also update userPosts cache if it exists
      queryClient.setQueryData<ApiResponse<PostsResponse>>(["userPosts"], (oldResponse) => {
        if (!oldResponse?.data?.posts) return oldResponse
        
        return {
          ...oldResponse,
          data: {
            ...oldResponse.data,
            posts: oldResponse.data.posts.filter((post: Post) => post._id !== postId)
          }
        }
      })

      return { previousPostsResponse, previousUserPostsResponse }
    },

    onError: (err: Error, postId: string, context) => {
      // Rollback on error
      if (context?.previousPostsResponse) {
        queryClient.setQueryData(["posts"], context.previousPostsResponse)
      }
      if (context?.previousUserPostsResponse) {
        queryClient.setQueryData(["userPosts"], context.previousUserPostsResponse)
      }
    },

    onSuccess: () => {
      // No need to invalidate - optimistic update is already applied
      // Only refetch if we want to ensure data consistency (optional)
    }
  })
  
  const checkIsLiked = (postLikes: string[], currentUser: User | undefined): boolean => {
    return Boolean(currentUser && postLikes.includes(currentUser._id));
  };

  const toggleLike = (postId: string): void => {
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
