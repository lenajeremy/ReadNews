import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native'
import useCachedResources from '../hooks/useCachedResources'
import { StatusBar } from '../components'
import { ThemeProvider } from '@shopify/restyle'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import store from '../redux/store'
import * as Notifications from 'expo-notifications'
import useLocalStorage from '../hooks/useLocalStorage'
import { PUSH_NOTIFICATION_TOKEN_KEY } from '../constants'
import * as Linking from 'expo-linking'
import BottomSheetProvider from '../contexts/BottomSheetContext'
import useCurrentTheme from '../hooks/useCurrentTheme'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Constants from 'expo-constants'
import { Stack } from 'expo-router'
import FeedbackNotifierContainer from '../components/FeedbackNotifier/FeedbackNotifierContainer'
import { Box } from '../components'


SplashScreen.preventAutoHideAsync().catch((error) => console.error(error))

function DefaultLayout() {
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
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator />
      </Box>
    )
  } else {
    return (
      <Provider {...{ store }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider theme={currentTheme.theme}>
            <SafeAreaProvider>
              <BottomSheetProvider>
                <FeedbackNotifierContainer>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  </Stack>
                  <StatusBar />
                </FeedbackNotifierContainer>
              </BottomSheetProvider>
            </SafeAreaProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </Provider>
    )
  }
}


export default DefaultLayout