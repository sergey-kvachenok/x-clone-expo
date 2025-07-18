import { Stack } from "expo-router";
import "../global.css"
import React from "react";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout()
{
  return (
     <ClerkProvider tokenCache={tokenCache}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="index" options={{headerShown: false}} /> */}
      </Stack>
      </ClerkProvider>
  )
   
}