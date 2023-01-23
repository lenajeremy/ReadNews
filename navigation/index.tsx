/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import { RootStackParamList } from './types'
import BottomTabNavigator from './BottomTabNavigator'
import AuthStackScreens from './AuthStackNavigator'
import { OpenNewsScreen } from '../screens'
import useLocalStorage from '../hooks/useLocalStorage'
import { USER_TOKEN_KEY } from '../constants'
import { ActivityIndicator } from 'react-native'
import { Box, Text } from '../components'
import { useLazyLoginWithTokenQuery } from '../api/authApi'
import { useAppDispatch } from '../hooks/reduxhooks'
import { updateDetails } from '../redux/slices/userSlice'

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createStackNavigator<RootStackParamList>()

function RootNavigator() {
  const [token, updateToken, isLoadingToken] = useLocalStorage<string>(USER_TOKEN_KEY)
  const [loginWithToken, { isFetching }] = useLazyLoginWithTokenQuery()

  const dispatch = useAppDispatch()

  React.useEffect(() => {
    async function login() {
      try {
        if (token) {
          const res = await loginWithToken(token).unwrap()
          dispatch(
            updateDetails({
              token: res.data.token,
              email: res.data.email,
              lastName: res.data.email,
              firstName: res.data.first_name,
            }),
          )
        }
      } catch (error) {
        updateToken(undefined)
      }
    }

    login()
  }, [token])

  if (isLoadingToken || isFetching) {
    return (
      <Box flex={1} alignItems={'center'} justifyContent={'center'} backgroundColor = 'mainBackground'>
        <ActivityIndicator />
        <Text>{String(isFetching) + String(isLoadingToken)}</Text>
      </Box>
    )
  }

  return (
    // @ts-ignore
    <Stack.Navigator initialRouteName={token ? 'Home' : 'Auth'}>
      {/* @ts-ignore */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        <Stack.Screen name="Auth" component={AuthStackScreens} />
        <Stack.Screen name="OpenNews" component={OpenNewsScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
