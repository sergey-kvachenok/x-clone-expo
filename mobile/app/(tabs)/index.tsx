import PostComposer from '@/components/PostComposer'
import PostsList from '@/components/PostsList'
import SignOutButton from '@/components/SignOutButton'
import { useUserSync } from '@/hooks/useUserSync'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  useUserSync()

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
          <Text className="text-lg font-bold">Home</Text>
          <SignOutButton />
        </View>

        <PostComposer />
        <PostsList />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
