import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";

const PostComposer = () => {
  const {
    content,
    setContent,
    selectedImage,
    pickImageFromGallery,
    takePhoto,
    removeImage,
    createPost,
    isPending,
  } = useCreatePost();
  const { user } = useUser();

  const isContentPresented = content.trim().length || selectedImage;
  const isBUttonDisabled =
    content.length >= 280 || isPending || !isContentPresented;
  const isTextCloseToLimit = content.length >= 260;

  return (
    <View className="bg-white">
      <View className="flex-row items-center gap-3  p-4">
        <Image
          source={{ uri: user?.imageUrl }}
          className="h-8 w-8 rounded-full"
        />
        <TextInput
          multiline
          placeholder="What is on your mind?"
          value={content}
          onChangeText={setContent}
          className="flex-1 p-0 text-sm leading-6"
          maxLength={280}
          placeholderTextColor="#657786"
        />
      </View>

      {selectedImage && (
        <View className="relative flex-row items-center px-4 py-2">
          <Image
            source={{ uri: selectedImage }}
            className="h-48 w-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute right-6 top-6 h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-60"
            onPress={removeImage}
          >
            <Feather name="x" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row items-center justify-between  p-4">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={pickImageFromGallery}>
            <Feather name="image" size={20} color="#1DA1F2" />
          </TouchableOpacity>

          <TouchableOpacity className="mr-4" onPress={takePhoto}>
            <Feather name="camera" size={20} color="#1DA1F2" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-2">
          <Text
            className={`${isTextCloseToLimit ? "text-red-500" : "text-gray-500"} text-xs`}
          >
            {280 - content.length}
          </Text>
          <TouchableOpacity
            className={`${isContentPresented ? "bg-blue-500" : "bg-gray-300"}  rounded-full px-4 py-2`}
            onPress={createPost}
            disabled={isBUttonDisabled}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                className={`${isContentPresented ? "text-white" : "text-gray-500"} font-bold`}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostComposer;
