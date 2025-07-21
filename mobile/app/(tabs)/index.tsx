import PostComposer from '@/components/PostComposer'
import SignOutButton from '@/components/SignOutButton'
import { useUserSync } from '@/hooks/useUserSync'
import { useClerk } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () =>
{
  useUserSync()
  const { signOut } = useClerk()

  return (
    <SafeAreaView className="flex-1 bg-gray-300">
     
      <View className="flex-row items-center justify-between px-4 py-3">
         <Ionicons name="logo-twitter" size={20}  color="#1DA1F2"/>
      <Text className="text-lg font-bold">Home</Text>
        <SignOutButton />
      </View>
      
      <PostComposer />
    </SafeAreaView>
  )
}

export default Home

