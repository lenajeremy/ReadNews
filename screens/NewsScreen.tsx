import { useTheme } from '@shopify/restyle'
import {
  SafeAreaView,
  useColorScheme,
} from 'react-native'
import { Header, News } from '../components'
import { Theme } from '../theme'

export const NewsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const { colors } = useTheme<Theme>()

  return (
    <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
      <Header />
      <News />
    </SafeAreaView>
  )
}

export default NewsScreen
