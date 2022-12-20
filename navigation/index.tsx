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
  return (
    // @ts-ignore
    <Stack.Navigator initialRouteName="Auth">

      {/* @ts-ignore */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        <Stack.Screen name="Auth" component={AuthStackScreens} />
      </Stack.Group>
      
    </Stack.Navigator>
  )
}
