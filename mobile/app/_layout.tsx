import { Stack } from 'expo-router'
import '../global.css'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
       
    <ClerkProvider tokenCache={tokenCache}>
       <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
            </QueryClientProvider>
      </ClerkProvider>

  )
}
