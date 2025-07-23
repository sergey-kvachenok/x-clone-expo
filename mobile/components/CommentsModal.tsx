import { useComments } from '@/hooks/useComments'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Post, Comment } from '@/types'
import { useMemo } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native'

interface CommentsModalProps {
  selectedPost: Post
  onClose: () => void
}

const CommentsModal = ({ selectedPost, onClose }: CommentsModalProps) => {
  const { commentText, setCommentText, createComment, isCreatingComment } = useComments()
  const { currentUser } = useCurrentUser()

  const handleClose = () => {
    onClose()
    setCommentText('')
  }

  return (
    <Modal visible={!!selectedPost} animationType="slide" presentationStyle="pageSheet">
      {/* MODAL HEADER */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={handleClose}>
          <Text className="text-lg text-blue-500">Close</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Comments</Text>
        <View className="w-12" />
      </View>

      {selectedPost && (
        <ScrollView className="flex-1">
          {/* ORIGINAL POST */}
          <View className="border-b border-gray-100 bg-white p-4">
            <View className="flex-row">
              <Image
                source={{ uri: selectedPost.user.profilePicture }}
                className="mr-3 size-12 rounded-full"
              />

              <View className="flex-1">
                <View className="mb-1 flex-row items-center">
                  <Text className="mr-1 font-bold text-gray-900">
                    {selectedPost.user.firstName} {selectedPost.user.lastName}
                  </Text>
                  <Text className="ml-1 text-gray-500">@{selectedPost.user.username}</Text>
                </View>

                {selectedPost.content && (
                  <Text className="mb-3 text-base leading-5 text-gray-900">
                    {selectedPost.content}
                  </Text>
                )}

                {selectedPost.image && (
                  <Image
                    source={{ uri: selectedPost.image }}
                    className="mb-3 h-48 w-full rounded-2xl"
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>
          </View>

          {/* COMMENTS LIST */}
          {selectedPost.comments.map(comment => (
            <View key={comment._id} className="border-b border-gray-100 bg-white p-4">
              <View className="flex-row">
                <Image
                  source={{ uri: comment.user.profilePicture }}
                  className="mr-3 h-10 w-10 rounded-full"
                />

                <View className="flex-1">
                  <View className="mb-1 flex-row items-center">
                    <Text className="mr-1 font-bold text-gray-900">
                      {comment.user.firstName} {comment.user.lastName}
                    </Text>
                    <Text className="ml-1 text-sm text-gray-500">@{comment.user.username}</Text>
                  </View>

                  <Text className="mb-2 text-base leading-5 text-gray-900">{comment.content}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* ADD COMMENT INPUT */}

          <View className="border-t border-gray-100 p-4">
            <View className="flex-row">
              <Image
                source={{ uri: currentUser?.profilePicture }}
                className="mr-3 size-10 rounded-full"
              />

              <View className="flex-1">
                <TextInput
                  className="mb-3 rounded-lg border border-gray-200 p-3 text-base"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  className={`self-start rounded-lg px-4 py-2 ${
                    commentText.trim() ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onPress={() => createComment(selectedPost._id)}
                  disabled={isCreatingComment || !commentText.trim()}
                >
                  {isCreatingComment ? (
                    <ActivityIndicator size={'small'} color={'white'} />
                  ) : (
                    <Text
                      className={`font-semibold ${
                        commentText.trim() ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      Reply
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Modal>
  )
}

export default CommentsModal
