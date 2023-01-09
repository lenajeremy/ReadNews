import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { Text, Box } from '../components'

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box backgroundColor="mainBackground" flex={1}>
        <Text variant="heading1">This is the Profile Screen</Text>
      </Box>
    </SafeAreaView>
  )
}

export default ProfileScreen
