import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { Box, Text } from '../components'

const ExploreScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box backgroundColor="mainBackground" flex={1}>
        <Text variant="heading1">This is the explore Screen</Text>
      </Box>
    </SafeAreaView>
  )
}

export default ExploreScreen
