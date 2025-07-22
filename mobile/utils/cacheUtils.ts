import { QueryClient } from "@tanstack/react-query";
import { Post, Comment, ApiResponse, PostsResponse } from "@/types";

// Universal function to update posts cache
export const updatePostsCache = (
  queryClient: QueryClient,
  postId: string,
  updateFn: (post: Post) => Post
): void => {
  queryClient.setQueryData<ApiResponse<PostsResponse>>(["posts"], (old) => {
    if (!old?.data?.posts) return old;
    
    return {
      ...old,
      data: {
        ...old.data,
        posts: old.data.posts.map((post: Post) => 
          post._id === postId ? updateFn(post) : post
        )
      }
    };
  });
};

// Helper for adding optimistic comment
export const addOptimisticComment = (post: Post, comment: Partial<Comment>): Post => ({
  ...post,
  comments: [...post.comments, comment as Comment]
});

// Helper for replacing optimistic comment with real one
export const replaceOptimisticComment = (post: Post, realComment: Comment): Post => ({
  ...post,
  comments: [
    ...post.comments.filter(c => !c._id.startsWith('temp-')),
    realComment
  ]
});

// Helper for toggling likes
export const togglePostLike = (post: Post, userId: string): Post => {
  const isCurrentlyLiked = post.likes.includes(userId);
  return {
    ...post,
    likes: isCurrentlyLiked 
      ? post.likes.filter((id: string) => id !== userId)
      : [...post.likes, userId]
  };
}; 