import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Text } from 'react-native'
import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { StatusBar } from './components'
import { useColorScheme, Alert } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import theme, { darkTheme } from './theme'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import store from './redux/store'
import * as Notifications from 'expo-notifications'
import useLocalStorage from './hooks/useLocalStorage'
import { PUSH_NOTIFICATION_TOKEN_KEY } from './constants'
import * as Linking from 'expo-linking'
import BottomSheetProvider from './contexts/BottomSheetContext'
import useCurrentTheme from './hooks/useCurrentTheme'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Constants from 'expo-constants'


SplashScreen.preventAutoHideAsync().catch((error) => console.error(error))

export default function App() {
  const isLoadingResourcesComplete = useCachedResources()
  const [
    pushNotificationToken,
    updatePushNotificationToken,
    isLoadingPushNotificationtoken,
    clearAll,
  ] = useLocalStorage<string>(PUSH_NOTIFICATION_TOKEN_KEY)

  const [appLoaded, setAppLoaded] = React.useState(false)

  const currentTheme = useCurrentTheme()

  // React.useEffect(() => {
    // async function scheduleNotifications() {
    //   const res = await Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: 'Jello',
    //       subtitle: 'Hoe are you?',
    //       data: { person: 'this is the data fro the notification' },
    //       badge: 10,
    //       sound: true,
    //       vibrate: [4],
    //     },
    //     trigger: {
    //       seconds: 60,
    //       repeats: true,
    //     },
    //   })

    //   console.log(res)
    // }

    // async function getPushToken(): Promise<string | null> {
    //   const { granted } = await Notifications.getPermissionsAsync()

    //   console.log('permission:', granted)
    //   console.log('project id:', Constants.default.easConfig?.projectId)

    //   if (granted) {
    //     const token = await Notifications.getExpoPushTokenAsync({ projectId: Constants.default.easConfig?.projectId })
    //     return token.data
    //   } else {
    //     const { granted } = await Notifications.requestPermissionsAsync()

    //     if (!granted) {
    //       Alert.alert(
    //         'Permission Not Granted',
    //         'Permission is required to be able to send you updates on articles you might be interested in.\n\nPlease go to setting to allow notifications',
    //       )

    //       return null
    //     } else return getPushToken()
    //   }
    // }

    // if (!isLoadingPushNotificationtoken && !pushNotificationToken) {
    //   getPushToken().then((token) => {
    //     if (token) {
    //       updatePushNotificationToken(token)
    //     }
    //   })
    // } else {
    //   console.log('the token already exists')
    // }

  // }, [isLoadingPushNotificationtoken])

  React.useEffect(() => {
    if (isLoadingResourcesComplete) {
      setAppLoaded(true)
      SplashScreen.hideAsync()
    }
  }, [isLoadingResourcesComplete])

  if (!appLoaded) {
    return <Text style = {{ fontSize: 50, color: 'black' }}>Loading resources</Text>
  } else {
    return (
      <Provider {...{ store }}>
        <GestureHandlerRootView>
          <ThemeProvider theme={currentTheme.theme}>
            <SafeAreaProvider>
              {/* <BottomSheetProvider> */}
                <Navigation />
                <StatusBar />
              {/* </BottomSheetProvider> */}
            </SafeAreaProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </Provider>
    )
  }
}
