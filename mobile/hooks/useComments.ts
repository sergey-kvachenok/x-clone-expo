import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useApiClient, commentApi } from "../utils/api";
import { updatePostsCache, addOptimisticComment, replaceOptimisticComment } from "../utils/cacheUtils";
import { CommentResponse, Comment, ApiResponse, PostsResponse } from "@/types";

interface CreateCommentParams {
  postId: string;
  content: string;
}

export const useComments = () => {
  const [commentText, setCommentText] = useState("");
  const api = useApiClient();
  const queryClient = useQueryClient();


  const createCommentMutation = useMutation<CommentResponse, Error, CreateCommentParams, { previousPosts?: ApiResponse<PostsResponse> }>({
    mutationFn: async ({ postId, content }: CreateCommentParams) => {
      const response = await commentApi.createComment(api, postId, content);
      return response.data;
    },
    
    // onMutate: async ({ postId, content }: CreateCommentParams) => {
    //   await queryClient.cancelQueries({ queryKey: ["posts"] });
    //   const previousPosts = queryClient.getQueryData<ApiResponse<PostsResponse>>(["posts"]);
      
    //   // Create optimistic comment
    //   const optimisticComment: Partial<Comment> = {
    //     _id: `temp-${Date.now()}`,
    //     content,
    //     createdAt: new Date().toISOString(),
    //     user: { _id: 'current-user', username: 'You', firstName: '', lastName: '' }
    //   };

    //   // setCreatedComment(optimisticComment);
      
    //   updatePostsCache(queryClient, postId, (post) => 
    //     addOptimisticComment(post, optimisticComment)
    //   );
      
    //   return { previousPosts };
    // },
    
    onSuccess: (realComment: CommentResponse, { postId }: CreateCommentParams) => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
     
      
      updatePostsCache(queryClient, postId, (post) =>
      {
    
        
        return replaceOptimisticComment(post, realComment.comment)
      }
      );
    },
    
    onError: (error: Error, { postId }: CreateCommentParams, context) => {
      // Remove optimistic comment on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      Alert.alert("Error", "Failed to post comment. Try again.");
    },
  });

  const createComment = (postId: string): void => {
    if (!commentText.trim()) {
      Alert.alert("Empty Comment", "Please write something before posting!");
      return;
    }

    createCommentMutation.mutate({ postId, content: commentText.trim() });
  };

  return {
    commentText,
    setCommentText,
    createComment,
    isCreatingComment: createCommentMutation.isPending,

  };
};