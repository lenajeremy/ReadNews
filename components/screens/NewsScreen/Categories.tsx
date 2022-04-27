import React, { useState } from 'react'
import { Pressable } from 'react-native'
import { Box, Text } from '../../shared'

const Categories: React.FC = () => {
  type CategoryOptions = 'Feeds' | 'Popular' | 'Following'

  const categories: CategoryOptions[] = ['Feeds', 'Popular', 'Following']

  const [activeCategory, setActiveCategory] = useState<CategoryOptions>('Feeds')

  const Category: React.FC<{ title: CategoryOptions }> = ({ title }) => {
    return (
      <Pressable
        onPress={() => setActiveCategory(title)}
        style={{ width: '32%' }}
      >
        <Box
          width={'100%'}
          padding="sm"
          backgroundColor={
            activeCategory === title ? 'mainBackground' : 'transparent'
          }
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            color={activeCategory === title ? 'mainText' : 'mutedText'}
            fontSize={12}
          >
            {title}
          </Text>
        </Box>
      </Pressable>
    )
  }

  return (
    <Box
      marginVertical="md"
      borderRadius={20}
      marginHorizontal={'lg'}
      backgroundColor="transparentBackground"
      padding={'xxs'}
      flexDirection="row"
      justifyContent="space-between"
    >
      {categories.map((category, index) => (
        <Category title={category} key={index} />
      ))}
    </Box>
  )
}

export default Categories
