import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { postApi } from "@/utils/api";
import { useApiClient } from "@/utils/api";
import { Post, PostsResponse } from "@/types";
import {
  optimisticDeletePost,
  optimisticUpdatePost,
  togglePostLike,
} from "@/utils/cacheUtils";
import { AxiosResponse } from "axios";

export const usePosts = (username?: string) => {
  const { userId: currentUserId } = useAuth();
  const api = useApiClient();
  const queryClient = useQueryClient();
  const queryKey = username ? ["userPosts", username] : ["posts"];

  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey,
    queryFn: () =>
      username ? postApi.getUserPosts(api, username) : postApi.getPosts(api),
    select: (response) => response.data.posts,
  });

  const { mutate: likePostMutation } = useMutation<
    unknown,
    Error,
    string,
    {
      previousPostsResponse?: AxiosResponse<PostsResponse>;
      previousUserPostsResponse?: AxiosResponse<PostsResponse>;
    }
  >({
    mutationFn: (postId: string) => postApi.likePost(api, postId),

    onMutate: async (postId: string) => {
      if (!currentUserId) return {};

      const previousPostsResponse = await optimisticUpdatePost(
        queryClient,
        ["posts"],
        postId,
        (post) => togglePostLike(post, currentUserId),
      );

      let previousUserPostsResponse;
      if (username) {
        previousUserPostsResponse = await optimisticUpdatePost(
          queryClient,
          ["userPosts", username],
          postId,
          (post) => togglePostLike(post, currentUserId),
        );
      }

      return {
        previousPostsResponse: previousPostsResponse?.previousResponse,
        previousUserPostsResponse: previousUserPostsResponse?.previousResponse,
      };
    },

    onError: (err, postId, context) => {
      console.error("Error liking post:", err);
      if (context?.previousPostsResponse) {
        queryClient.setQueryData(["posts"], context.previousPostsResponse);
      }
      if (context?.previousUserPostsResponse && username) {
        queryClient.setQueryData(
          ["userPosts", username],
          context.previousUserPostsResponse,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const { mutate: deletePostMutation } = useMutation<
    unknown,
    Error,
    string,
    {
      previousPostsResponse?: AxiosResponse<PostsResponse>;
      previousUserPostsResponse?: AxiosResponse<PostsResponse>;
    }
  >({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),

    onMutate: async (postId: string) => {
      const previousPostsResponse = await optimisticDeletePost(
        queryClient,
        ["posts"],
        postId,
      );

      let previousUserPostsResponse;
      if (username) {
        previousUserPostsResponse = await optimisticDeletePost(
          queryClient,
          ["userPosts", username],
          postId,
        );
      }
      return {
        previousPostsResponse: previousPostsResponse?.previousResponse,
        previousUserPostsResponse: previousUserPostsResponse?.previousResponse,
      };
    },
    onError: (err, postId, context) => {
      console.error("Error deleting post:", err);
      if (context?.previousPostsResponse) {
        queryClient.setQueryData(["posts"], context.previousPostsResponse);
      }
      if (context?.previousUserPostsResponse && username) {
        queryClient.setQueryData(
          ["userPosts", username],
          context.previousUserPostsResponse,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  return {
    posts: (posts || []) as Post[],
    isLoading,
    isRefetching,
    refetch,
    likePost: likePostMutation,
    deletePost: deletePostMutation,
    currentUserId,
    error,
  };
};
