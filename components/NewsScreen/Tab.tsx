import React, { useState } from 'react'
import { Box, PressableWithHaptics, Text } from '../shared'
import Animated from 'react-native-reanimated'

const AnimatedBox = Animated.createAnimatedComponent(Box)

const Tab = function <T>({
  tabValues,
  initialIndex,
  onChange,
}: {
  tabValues: Array<T>
  initialIndex: number
  onChange: (newValue: T, index: number) => void
}) {

  const [activeTabValue, setActiveTabValue] = useState<T>(
    tabValues[initialIndex],
  )

  const TabItem: React.FC<{ title: T; index: number }> = ({ title, index }) => {
    return (
      <PressableWithHaptics
        onPress={() => {
          setActiveTabValue(title)
          onChange(title, index)
        }}
        style={{ width: 100 / tabValues.length + '%' }}
      >
        <Box
          width={'100%'}
          padding="sm"
          backgroundColor={
            activeTabValue === title ? 'mainBackground' : 'transparent'
          }
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            color={activeTabValue === title ? 'mainText' : 'mutedText'}
            fontSize={14}
          >
            {title as string}
          </Text>
        </Box>
      </PressableWithHaptics>
    )
  }

  return (
    <Box backgroundColor="mainBackground">
      <AnimatedBox
        marginBottom="sm"
        borderRadius={20}
        backgroundColor="transparentBackground"
        padding={'xxs'}
        flexDirection="row"
        justifyContent="space-between"
      >
        {tabValues.map((tabValue, index) => (
          <TabItem title={tabValue} key={index} index={index} />
        ))}
      </AnimatedBox>
    </Box>
  )
}

export default Tab
