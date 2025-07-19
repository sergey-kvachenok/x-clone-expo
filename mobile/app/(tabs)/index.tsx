import SignOutButton from '@/components/SignOutButton'
import { useClerk } from '@clerk/clerk-expo'
import React from 'react'
import { View, Text, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const { signOut } = useClerk()

  return (
    <SafeAreaView className="flex-1">
      <Text>Home page</Text>

      <SignOutButton />
    </SafeAreaView>
  )
}

export default Home
