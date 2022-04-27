import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { StatusBar } from './components'
import { useColorScheme } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import theme, { darkTheme } from './theme'

export default function App() {
  const isLoadingComplete = useCachedResources()
  const isDarkMode = useColorScheme() === 'dark'

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </ThemeProvider>
    )
  }
}
