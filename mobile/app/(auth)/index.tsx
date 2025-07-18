
import { useSocialAuth } from "@/hooks/useSocialAuth";
import {  Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";

export default function Index()
{
  const { isLoading, handleSocialAuth}  = useSocialAuth()

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <View className="flex flex-col gap-10">
          <Image source={require("../../assets/images/auth2.png")}
            className="size-96"
          />

          <View className="flex flex-col gap-3">
            <TouchableOpacity
              onPress={() =>
              {
                handleSocialAuth("oauth_google")
               }}
              disabled={isLoading}
              className="flex flex-row justify-center items-center gap-3 border border-gray-300 rounded-full h-12 disabled:border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
            >
          
              {isLoading ? <ActivityIndicator size="small" color="#000"/> : <Image source={require('../../assets/images/google.png')}
                resizeMode="contain"
                className="size-10"
              />}
              
            <Text className={`font-medium ${isLoading ? "text-gray-300" : "text-black"}`}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
               onPress={() =>
              {
                handleSocialAuth("oauth_apple")
               }}
              disabled={isLoading}
              className="flex flex-row justify-center items-center gap-3 border border-gray-300 rounded-full py-2 h-12 disabled:border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
            >
              {isLoading ? <ActivityIndicator size="small" color="#000" /> : <Image source={require('../../assets/images/apple.png')}
                resizeMode="contain"
                className="size-8"
              />}
              
              <Text className={`font-medium ${isLoading ? "text-gray-300" : "text-black"}`}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="pb-10">
        <Text className="text-center text-gray-500 text-xs leading-4 px-2">
          By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
          {", "}
          <Text className="text-blue-500">Privacy Policy</Text>
          {", and "}
          <Text className="text-blue-500">Cookie Use</Text>.
        </Text>
      </View>
    </View>
  )
}

