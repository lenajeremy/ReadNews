import { useTheme } from '@shopify/restyle'
import {
  Pressable,
  StatusBar,
  SafeAreaView,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native'
import { Box, Categories, FeaturedNews, Header, News, Text } from '../components'
import { Theme } from '../theme'
import { getDateText, getTimeOfDay } from '../utils/dateutils'

export const NewsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const { colors } = useTheme<Theme>()

  return (
    <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
      <StatusBar
        backgroundColor={colors.mainBackground}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
        <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <GreetingBanner />
        <Categories />
        
        <FeaturedNews />
        <NewsForYou />
      </ScrollView>
    </SafeAreaView>
  )
}

const NewsForYou: React.FC = () => {
  return (
    <Box paddingHorizontal="lg" paddingVertical="md">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="md"
      >
        <Text
          variant="heading3"
          fontSize={20}
          fontFamily="Inter-Bold"
          color="mainText"
        >
          Just For You
        </Text>
        <Pressable
          onPress={() => Alert.alert('hello', 'someting is happening')}
        >
          <Text style={{ color: '#2b7efe' }} fontFamily="Inter-SemiBold">
            See More
          </Text>
        </Pressable>
      </Box>
      <News />
    </Box>
  )
}

const GreetingBanner: React.FC = () => {
  return (
    <Box paddingHorizontal="lg" paddingVertical="sm">
      <Text color="mutedText" marginBottom="xs" fontSize={14}>
        {getDateText()}
      </Text>
      <Text variant="heading3" fontFamily="Inter-SemiBold" color="mainText">
        {getTimeOfDay()}, {'\n'}Jeremiah
      </Text>
    </Box>
  )
}


export default NewsScreen;