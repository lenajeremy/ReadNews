import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthStackParamList } from './types'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import OnboardingScreen from '../screens/OnboardingScreen'
import SetInterestScreen from '../screens/SetInterestScreen'
import RequestPasswordResetScreen from '../screens/RequestPasswordResetScreen'
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import useLocalStorage from '../hooks/useLocalStorage'
import { HAS_OPENED_APP } from '../constants'

const AuthStackNavigator = createStackNavigator<AuthStackParamList>()

const AuthStackScreens = () => {
  const [hasOpenedApp, , isLoadingHasOpenedApp] = useLocalStorage<boolean>(
    HAS_OPENED_APP,
  )

  if (isLoadingHasOpenedApp) return null

  return (
    // @ts-ignore
    <AuthStackNavigator.Navigator
      initialRouteName={hasOpenedApp ? 'Login' : 'Onboarding'}
    >
      {/* @ts-ignore  */}
      <AuthStackNavigator.Group screenOptions={{ headerShown: false }}>
        {/* @ts-ignore  */}
        <AuthStackNavigator.Screen
          name="Onboarding"
          component={OnboardingScreen}
        />
        <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
        <AuthStackNavigator.Screen name="Register" component={RegisterScreen} />
        <AuthStackNavigator.Screen
          name="RequestPasswordReset"
          component={RequestPasswordResetScreen}
        />
        <AuthStackNavigator.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
        />
        <AuthStackNavigator.Screen
          name="SetInterest"
          component={SetInterestScreen}
        />
      </AuthStackNavigator.Group>
    </AuthStackNavigator.Navigator>
  )
}

export default AuthStackScreens
