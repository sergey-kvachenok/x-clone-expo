import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { usePosts } from '@/hooks/usePosts'
import PostCard from './PostCard'
import { Post } from '@/types'
import CommentsModal from './CommentsModal'


const PostsList = () => {
  const { currentUser } = useCurrentUser()
  const { posts, isLoading, error, refetch, toggleLike, deletePost, checkIsLiked } =
    usePosts(currentUser);
  
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const selectedPost = useMemo(() =>
  {
    return posts.find((post: Post) => post._id === selectedPostId)
  }, [selectedPostId, posts])

  if (isLoading) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text className="text-gray-500 mt-2">Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500 mb-4">Failed to load posts</Text>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => refetch()}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }

  // Don't render if currentUser is not loaded yet
  if (!currentUser) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text className="text-gray-500 mt-2">Loading user...</Text>
      </View>
    );
  }
  
  return (
    <>
      {posts.map((post: Post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={toggleLike}
          onDelete={deletePost}
          onComment={(post: Post) => setSelectedPostId(post._id)}
          currentUser={currentUser}
          isLiked={checkIsLiked(post.likes, currentUser)}
        />
      ))}

        {selectedPost && <CommentsModal selectedPost={selectedPost} onClose={() => setSelectedPostId('')} />}
    </>
  )
}

export default PostsList