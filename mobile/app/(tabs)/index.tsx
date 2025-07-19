import SignOutButton from '@/components/SignOutButton'
import { useUserSync } from '@/hooks/useUserSync'
import { useClerk } from '@clerk/clerk-expo'
import React from 'react'
import { View, Text, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () =>
{
  useUserSync()
  const { signOut } = useClerk()

  return (
    <SafeAreaView className="flex-1">
      <Text>Home page</Text>

      <SignOutButton />
    </SafeAreaView>
  )
}

export default Home

