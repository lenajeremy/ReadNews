import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './types'
import BottomTabNavigator from './BottomTabNavigator'
import AuthStackScreens from './AuthStackNavigator'
import { OpenNewsScreen } from '../screens'
import useLocalStorage from '../hooks/useLocalStorage'
import { USER_TOKEN_KEY } from '../constants'
import { ActivityIndicator, useWindowDimensions } from 'react-native'
import { Box, PressableWithHaptics, Text } from '../components'
import { useLazyLoginWithTokenQuery } from '../api/authApi'
import { useAppDispatch } from '../hooks/reduxhooks'
import { updateDetails } from '../redux/slices/userSlice'
import FeedbackNotifierContainer from '../components/FeedbackNotifier/FeedbackNotifierContainer'


export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const { height } = useWindowDimensions()
  const [token, updateToken, isLoadingToken, clear] = useLocalStorage<string>(
    USER_TOKEN_KEY,
  )
  const [loginWithToken, { isFetching, isError }] = useLazyLoginWithTokenQuery()

  const dispatch = useAppDispatch()

  React.useEffect(() => {
    async function login() {
      try {
        if (token && typeof token === 'string') {
          const res = await loginWithToken(token).unwrap()
          dispatch(
            updateDetails({
              token: res.data.token,
              email: res.data.email,
              lastName: res.data.last_name,
              firstName: res.data.first_name,
            }),
          )
        }
      } catch (error) {
        // updateToken(undefined)
      }
    }

    login()
    // clear()
  }, [token])

  if (isError) {
    return (
      <Box backgroundColor='mainBackground' alignItems='center' height={height} justifyContent='center'>
        <Text>{'Awww... An error occured'}</Text>
        <PressableWithHaptics onPress={() => loginWithToken(token as string)}>
          <Text>
            Retry
          </Text>
        </PressableWithHaptics>
      </Box>
    )
  }

  if (isLoadingToken || isFetching) {
    return (
      <Box
        flex={1}
        alignItems={'center'}
        justifyContent={'center'}
        backgroundColor="mainBackground"
      >
        <ActivityIndicator />
      </Box>
    )
  }

  return (
    <FeedbackNotifierContainer>
      {/* @ts-ignore */}
      <Stack.Navigator initialRouteName={token ? 'Home' : 'Auth'}>
        {/* @ts-ignore */}
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={BottomTabNavigator} />
          <Stack.Screen name="Auth" component={AuthStackScreens} />
          <Stack.Screen name="OpenNews" component={OpenNewsScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </FeedbackNotifierContainer>
  )
}
