import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { StatusBar } from './components'
import { useColorScheme } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import theme, { darkTheme } from './theme'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import store from './redux/store'

SplashScreen.preventAutoHideAsync().catch((error) => console.error(error))

export default function App() {
  const isLoadingResourcesComplete = useCachedResources()

  const [appLoaded, setAppLoaded] = React.useState(false)
  const isDarkMode = useColorScheme() === 'dark'


  React.useEffect(() => {
    if (isLoadingResourcesComplete) {
      setAppLoaded(true)
      SplashScreen.hideAsync()
    }
  }, [isLoadingResourcesComplete])

  if (!appLoaded) {
    return null
  } else {
    return (
      <Provider {...{ store }}>
        <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    )
  }
}
