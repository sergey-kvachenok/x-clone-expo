import { QueryClient } from "@tanstack/react-query";
import { Post, Comment as CommentType, PostsResponse } from "@/types";
import { AxiosResponse } from "axios";

// Optimistically updates a single post in a query's post list.
export const optimisticUpdatePost = async (
  queryClient: QueryClient,
  queryKey: string[],
  postId: string,
  updateFn: (post: Post) => Post,
) => {
  // Cancel queries to prevent them from overwriting our optimistic update
  await queryClient.cancelQueries({ queryKey });

  // Snapshot the previous value
  const previousResponse =
    queryClient.getQueryData<AxiosResponse<PostsResponse>>(queryKey);

  // Optimistically update to the new value
  queryClient.setQueryData<AxiosResponse<PostsResponse> | undefined>(
    queryKey,
    (old) => {
      if (!old?.data?.posts) return old;

      // Create a deep copy to avoid mutation issues
      const newResponse = JSON.parse(JSON.stringify(old));
      newResponse.data.posts = newResponse.data.posts.map((post: Post) =>
        post._id === postId ? updateFn(post) : post,
      );
      return newResponse;
    },
  );

  // Return a context object with the snapshotted value
  return { previousResponse };
};

// Optimistically deletes a post from a query's post list.
export const optimisticDeletePost = async (
  queryClient: QueryClient,
  queryKey: string[],
  postId: string,
) => {
  await queryClient.cancelQueries({ queryKey });

  const previousResponse =
    queryClient.getQueryData<AxiosResponse<PostsResponse>>(queryKey);

  queryClient.setQueryData<AxiosResponse<PostsResponse> | undefined>(
    queryKey,
    (old) => {
      if (!old?.data?.posts) return old;

      const newResponse = JSON.parse(JSON.stringify(old));
      newResponse.data.posts = newResponse.data.posts.filter(
        (post: Post) => post._id !== postId,
      );
      return newResponse;
    },
  );

  return { previousResponse };
};

// Helper for adding optimistic comment
export const addOptimisticComment = (
  post: Post,
  comment: Partial<CommentType>,
): Post => ({
  ...post,
  comments: [...post.comments, comment as CommentType],
});

// Helper for replacing optimistic comment with real one from the server
export const replaceOptimisticComment = (
  post: Post,
  realComment: CommentType,
): Post => ({
  ...post,
  comments: post.comments.map((comment) =>
    comment._id.startsWith("temp-") ? realComment : comment,
  ),
});

// Helper for toggling likes
export const togglePostLike = (post: Post, userId: string): Post => {
  const isCurrentlyLiked = post.likes.includes(userId);
  return {
    ...post,
    likes: isCurrentlyLiked
      ? post.likes.filter((id: string) => id !== userId)
      : [...post.likes, userId],
  };
};
