import { TextInput, View } from 'react-native'
import React, { FC } from 'react'
import { Feather } from '@expo/vector-icons'

interface ISearch
{
  className?: string
  placeholder?: string
}

export const Search: FC<ISearch> = ({className='', placeholder=''}) => {

    return (
   
      <View className={`flex-row bg-gray-200 items-center gap-3 rounded-full px-4 py-3 ${className}`}>
          <Feather name="search" color="#657786" size={20} />
          <TextInput 
            placeholder={placeholder ? placeholder : "Search"}
            className="text-sm" 
          />

      </View>
    )
  
}

export default Search