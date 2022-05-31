import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { useGetAllInterestsQuery } from '../api/userApi'
import { Theme } from '../theme'
import { Box, Text } from '../components'

const SetInterest = () => {
  const { height: DEVICE_HEIGHT } = useWindowDimensions()
  const { colors, spacing } = useTheme<Theme>()
  const {
    data: interests,
    isLoading,
    isError,
    isSuccess,
  } = useGetAllInterestsQuery()

  return (
    <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
      <Box paddingHorizontal="md" marginTop="xl" marginBottom="lg">
        <Text variant="heading2" lineHeight={36} style={{ width: '85%' }}>
          Your Interests
        </Text>
        <Text
          color="mutedText"
          style={{ width: '85%', marginTop: 2, fontSize: 16 }}
        >
          Select the topics you're interested to help us know the kind of news
          to recommend to you
        </Text>
      </Box>

      <ScrollView
        style={{
          marginHorizontal: spacing.md,
        }}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {isSuccess && <Text>{JSON.stringify(interests, null, 3)}</Text>}
        {isLoading && <ActivityIndicator color={'pink'} />}
      </ScrollView>

      <Box padding="xl" backgroundColor="chocolate" height={100}></Box>
    </SafeAreaView>
  )
}

export default SetInterest
