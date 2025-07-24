import PostComposer from "@/components/PostComposer";
import PostsList from "@/components/PostsList";
import SignOutButton from "@/components/SignOutButton";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
        <Text className="text-lg font-bold">Home</Text>
        <SignOutButton />
      </View>

      <PostComposer />
      <View style={{ paddingBottom: 160 }}>
        <PostsList isVirtualized={true} />
      </View>
    </SafeAreaView>
  );
}
