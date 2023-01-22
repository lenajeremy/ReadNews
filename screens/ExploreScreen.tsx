import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { Box, Text } from '../components'
import useLocalStorage from '../hooks/useLocalStorage'
import { HAS_OPENED_APP, USER_TOKEN_KEY } from '../constants'

const ExploreScreen = () => {
  const [, updateToken] = useLocalStorage<string>(USER_TOKEN_KEY)
  const [, updateIsOpen] = useLocalStorage<boolean>(HAS_OPENED_APP)

  React.useEffect(() => {
    updateToken(undefined)
    // updateIsOpen(undefined)

  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box backgroundColor="mainBackground" flex={1}>
        <Text variant="heading1">This is the explore Screen</Text>
      </Box>
    </SafeAreaView>
  )
}

export default ExploreScreen
