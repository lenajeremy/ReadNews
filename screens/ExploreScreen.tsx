import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { Box, Text, TextInput } from '../components'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { Ionicons } from '@expo/vector-icons'

const ExploreScreen = () => {
  const { colors, spacing } = useTheme<Theme>()

  const [searchText, setSearchText] = React.useState<string>('')
  const deferredSearchText = React.useDeferredValue(searchText)

  

  React.useEffect(() => {
    
  }, [deferredSearchText])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <Box backgroundColor="mainBackground" flex={1} padding="lg">
        <Text variant="heading1" marginBottom='md'>Search</Text>
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          icon={<Ionicons name="search" size={20} color={colors.mainText} />}
          placeholder="Type to search..."
          type="text"
          additionalStyles={{paddingRight: spacing.lg * 2, height: 60}}
          suffix = {<Box flex = {1} backgroundColor = 'mainText'></Box>}
        />
      </Box>
    </SafeAreaView>
  )
}

export default ExploreScreen
