import React, { useState } from 'react'
import { Box, PressableWithHaptics, Text } from '../shared'
import Animated from 'react-native-reanimated'

const AnimatedBox = Animated.createAnimatedComponent(Box)

const Categories: React.FC = () => {
  type CategoryOptions = 'Feeds' | 'Popular' | 'Following'

  const categories: CategoryOptions[] = ['Feeds', 'Popular', 'Following']

  const [activeCategory, setActiveCategory] = useState<CategoryOptions>('Feeds')

  const Category: React.FC<{ title: CategoryOptions }> = ({ title }) => {
    return (
      <PressableWithHaptics
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
      </PressableWithHaptics>
    )
  }

  return (
    <Box backgroundColor='mainBackground'>
      <AnimatedBox
        marginBottom="md"
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
      </AnimatedBox>
    </Box>
  )
}

export default Categories
