import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { ErrorBoundary, PressableWithHaptics, StatusBar } from './components'
import { useColorScheme, View, Text, Pressable } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import theme, { darkTheme } from './theme'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import store from './redux/store'
import * as Linking from 'expo-linking'
import * as Updates from 'expo-updates'

import 'react-native-url-polyfill/auto'

SplashScreen.preventAutoHideAsync().catch((error) => console.error(error))

export default function App() {
  const isLoadingResourcesComplete = useCachedResources()

  const [appLoaded, setAppLoaded] = React.useState(false)
  const isDarkMode = useColorScheme() === 'dark'

  const [hasError, setError] = React.useState(false)

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
      <ErrorBoundary onError={() => setError(true)}>
        {hasError ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text>An Error Occurred</Text>
            <PressableWithHaptics onPress = {Updates.reloadAsync}>
              <Text>Reload app</Text>
            </PressableWithHaptics>
          </View>
        ) : (
          <Provider {...{ store }}>
            <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
              <SafeAreaProvider>
                <Navigation />
                <StatusBar />
              </SafeAreaProvider>
            </ThemeProvider>
          </Provider>
        )}
      </ErrorBoundary>
    )
  }
}
