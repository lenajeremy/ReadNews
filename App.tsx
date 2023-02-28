import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { ErrorBoundary, PressableWithHaptics, StatusBar } from './components'
import { useColorScheme, View, Text, Alert } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import theme, { darkTheme } from './theme'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import store from './redux/store'
import * as Updates from 'expo-updates'
import * as Notifications from 'expo-notifications'
import useLocalStorage from './hooks/useLocalStorage'
import { PUSH_NOTIFICATION_TOKEN_KEY } from './constants'
import 'react-native-url-polyfill/auto'

SplashScreen.preventAutoHideAsync().catch((error) => console.error(error))

export default function App() {
  const isLoadingResourcesComplete = useCachedResources()
  const [
    pushNotificationToken,
    updatePushNotificationToken,
    isLoadingPushNotificationtoken,
  ] = useLocalStorage<string>(PUSH_NOTIFICATION_TOKEN_KEY)

  const [appLoaded, setAppLoaded] = React.useState(false)
  const isDarkMode = useColorScheme() === 'dark'

  const [hasError, setError] = React.useState(false)

  React.useEffect(() => {
    async function scheduleNotifications() {
      const res = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Jello',
          subtitle: 'Hoe are you?',
          data: { person: 'this is the data fro the notification' },
          badge: 10,
          sound: true,
          vibrate: [4],
        },
        trigger: {
          seconds: 60,
          repeats: true,
        },
      })

      console.log(res)
    }

    async function getPushToken(): Promise<string | null> {
      const { granted } = await Notifications.getPermissionsAsync()

      if (granted) {
        const token = await Notifications.getExpoPushTokenAsync()
        return token.data
      } else {
        const { granted } = await Notifications.requestPermissionsAsync()

        if (!granted) {
          Alert.alert(
            'Permission Not Granted',
            'Permission is required to be able to send you updates on articles you might be interested in.\n\nPlease go to setting to allow notifications',
          )

          return null
        } else return getPushToken()
      }
    }

    if (!isLoadingPushNotificationtoken && !pushNotificationToken) {
      console.log('the token does not exist')
      getPushToken().then((token) => {
        if (token) {
          updatePushNotificationToken(token)
        }
      })
    } else {
      console.log('the token already exists')
    }

    console.log(pushNotificationToken)
  }, [isLoadingPushNotificationtoken])

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
            <PressableWithHaptics onPress={Updates.reloadAsync}>
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
