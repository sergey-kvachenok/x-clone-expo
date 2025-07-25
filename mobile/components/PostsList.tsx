import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  ScrollView,
} from "react-native";
import React, { FC, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "./PostCard";
import { Post } from "@/types";
import CommentsModal from "./CommentsModal";
import * as Haptics from "expo-haptics";

interface IPostsList {
  isVirtualized?: boolean;
}

const PostsList: FC<IPostsList> = ({ isVirtualized = false }) => {
  const { currentUser } = useCurrentUser();
  const {
    posts,
    isLoading,
    isRefetching,
    refetch,
    likePost,
    deletePost,
    currentUserId,
    error,
  } = usePosts(currentUser?.username);

  const [selectedPostId, setSelectedPostId] = useState<string>("");

  const selectedPost = useMemo(() => {
    return posts.find((post: Post) => post._id === selectedPostId);
  }, [selectedPostId, posts]);

  const listComponent = useMemo(() => {
    if (isVirtualized) {
      return (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onLike={handleLike}
              onDelete={handleDelete}
              onComment={handleComment}
              isLiked={item.likes.includes(currentUserId as string)}
              currentUser={currentUser}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      );
    }

    return (
      <ScrollView>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onDelete={handleDelete}
            onComment={handleComment}
            isLiked={post.likes.includes(currentUserId as string)}
            currentUser={currentUser}
          />
        ))}
      </ScrollView>
    );
  }, [posts]);

  if (isLoading) {
    return (
      <View className="items-center p-8">
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text className="mt-2 text-gray-500">Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center p-8">
        <Text className="mb-4 text-gray-500">Failed to load posts</Text>
        <TouchableOpacity
          className="rounded-lg bg-blue-500 px-4 py-2"
          onPress={() => refetch()}
        >
          <Text className="font-semibold text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="items-center p-8">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }

  // Don't render if currentUser is not loaded yet
  if (!currentUser) {
    return (
      <View className="items-center p-8">
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text className="mt-2 text-gray-500">Loading user...</Text>
      </View>
    );
  }

  const handleLike = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likePost(postId);
  };

  const handleDelete = (postId: string) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deletePost(postId);
        },
        style: "destructive",
      },
    ]);
  };

  const handleComment = (post: Post) => {
    setSelectedPostId(post._id);
  };

  return (
    <View>
      {listComponent}
      {selectedPost && (
        <CommentsModal
          selectedPost={selectedPost}
          onClose={() => setSelectedPostId("")}
        />
      )}
    </View>
  );
};

export default PostsList;
