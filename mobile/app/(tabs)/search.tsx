import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

// TODO: make this screen working

const TRENDING_TOPICS = [
  { topic: '#ReactNative', tweets: '125K' },
  { topic: '#TypeScript', tweets: '89K' },
  { topic: '#WebDevelopment', tweets: '234K' },
  { topic: '#AI', tweets: '567K' },
  { topic: '#TechNews', tweets: '98K' },
]

const SearchScreen = () => {
  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <View className="px-4 py-3">
        <View className="flex-row items-center gap-3 rounded-full bg-gray-200 px-4 py-3">
          <Feather name="search" color="#657786" size={20} />
          <TextInput placeholder="Search" className="text-sm" />
        </View>
      </View>

      <ScrollView
        className="px-4"
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 text-xl font-bold">Trending for you</Text>

        <View className="flex-col gap-3">
          {TRENDING_TOPICS.map(({ topic, tweets }, index) => (
            <TouchableOpacity key={index}>
              <Text className="text-sm text-gray-500">Trending in Technology</Text>
              <Text className="text-lg font-bold">{topic}</Text>
              <Text className="text-sm text-gray-500">{tweets} Tweets</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SearchScreen
