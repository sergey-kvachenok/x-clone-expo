import { Redirect, Tabs } from "expo-router";
import React, { FC } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";

interface ICustomHeader {
  title: string;
}

const CustomHeader: FC<ICustomHeader> = ({ title }) => {
  return (
    <SafeAreaView style={{ backgroundColor: "#1DA1F2" }}>
      <View className="flex items-center py-2">
        <Text className="text-sm text-white">{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { isSignedIn, isLoaded } = useAuth();
  console.log("isSignedIn TabsLayout", { isSignedIn, isLoaded });
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }
  console.log("isSignedIn TabsLayout 2");
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1DA1F2",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          paddingTop: 8,
          height: 40 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather size={size} name="home" color={color} />
          ),
          // header: () => <CustomHeader title='Home' />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Feather size={size} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Feather size={size} name="bell" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Feather size={size} name="mail" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather size={size} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
