import EditProfileModal from "@/components/EditProfileModal";
import PostsList from "@/components/PostsList";
import SignOutButton from "@/components/SignOutButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ProfileScreens = () => {
  const { currentUser, isLoading } = useCurrentUser();
  console.log({ currentUser });
  const insets = useSafeAreaInsets();

  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = usePosts(currentUser?.username);

  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    refetch: refetchProfile,
  } = useProfile();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text className="text-sm text-gray-500">
            {userPosts.length} Posts
          </Text>
        </View>
        <SignOutButton />
      </View>

      <ScrollView
        className="flex-1"
        // contentContainerStyle={{ paddingBottom: 0 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetchProfile();
              refetchPosts();
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              currentUser.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="h-48 w-full"
          resizeMode="cover"
        />

        <View className="border-b border-gray-100 px-4 pb-4">
          <View className="-mt-16 mb-4 flex-row items-end justify-between">
            <Image
              source={{ uri: currentUser.profilePicture }}
              className="h-32 w-32 rounded-full border-4 border-white"
            />
            <TouchableOpacity
              className="rounded-full border border-gray-300 px-6 py-2"
              onPress={openEditModal}
            >
              <Text className="font-semibold text-gray-900">Edit profile</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <View className="mb-1 flex-row items-center">
              <Text className="mr-1 text-xl font-bold text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <Text className="mb-2 text-gray-500">@{currentUser.username}</Text>
            <Text className="mb-3 text-gray-900">{currentUser.bio}</Text>

            <View className="mb-2 flex-row items-center">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="ml-2 text-gray-500">{currentUser.location}</Text>
            </View>

            <View className="mb-3 flex-row items-center">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="ml-2 text-gray-500">
                Joined {format(new Date(currentUser.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {currentUser.following?.length}
                  </Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {currentUser.followers?.length}
                  </Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList />
      </ScrollView>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
        isUpdating={isUpdating}
      />
    </SafeAreaView>
  );
};

export default ProfileScreens;
