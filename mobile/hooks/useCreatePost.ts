import { useApiClient } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const mimeTypesMap = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
}

export const useCreatePost = () =>
{
    const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const api = useApiClient()
    const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData: { content: string, imageUri?: string }) =>
    {
      const formData = new FormData()
      if (postData.content) formData.append('content', postData.content)
      if (postData.imageUri)
      {

        const uriParts = postData.imageUri.split('.')
        const fileType = uriParts[uriParts.length - 1].toLocaleLowerCase()

        const mimeType = mimeTypesMap[fileType as keyof typeof mimeTypesMap] || mimeTypesMap['jpg']

        formData.append('image', {
          uri: postData.imageUri,
          name: `image.${fileType}`,
          type: mimeType,
        } as any)

      }
      
      const response = await api.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },

    onSuccess: () =>
    {
      setContent("")
      setSelectedImage(null)
      queryClient.invalidateQueries({ queryKey: ["posts"] });
       Alert.alert("Success", "Post created successfully!");
    },
    onError: (err: any) =>
    {
      console.log('Full error:', err)
      console.log('Error response:', err.response?.data)
      console.log('Error status:', err.response?.status)
      console.log('Error config:', err.config?.url)
      Alert.alert("Error", "Failed to create post. Please try again.");
    }
  })

  const handleImagePicker = useCallback(async (useCamera: boolean) =>
  {

    const permissionsResult = await (useCamera ? ImagePicker.requestCameraPermissionsAsync() : ImagePicker.requestMediaLibraryPermissionsAsync())
    
    if (!permissionsResult.granted)
    {
      const source = useCamera ? "camera" : "photo library"

      Alert.alert("Permission denied", `You need to grant permission to access your ${source} to upload a photo.`);
      return;
    }

    const pickerOptions = {
      allowsEditing: true,
      aspect: [16, 9] as [number, number],
      quality: 0.8,
    }



    const result = useCamera ?
      await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync({
        ...pickerOptions,
        mediaTypes: ["images"],
      })
    
    if (!result.canceled) setSelectedImage(result.assets[0].uri)
  }, [])

  const createPost = useCallback(() =>
  {
    if (!content.trim() && !selectedImage)
    {
      Alert.alert("Error", "Please enter a post content or select an image.");
      return;
    }

    const postData: {content: string, imageUri?: string} = {  
      content: content.trim(),

    }

    if (selectedImage) postData.imageUri = selectedImage;

    createPostMutation(postData)
  }, [content, selectedImage, createPostMutation])


  
  return {
    content,
    setContent,
    selectedImage,
    pickImageFromGallery: () => handleImagePicker(false),
    takePhoto: () => handleImagePicker(true),
    removeImage: () => setSelectedImage(null),
    createPost,
    isPending,
  }
}