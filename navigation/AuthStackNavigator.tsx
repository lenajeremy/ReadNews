import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthStackParamList } from './types'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import OnboardingScreen from '../screens/OnboardingScreen'
import SetInterestScreen from '../screens/SetInterestScreen'

const AuthStackNavigator = createNativeStackNavigator<AuthStackParamList>()

const AuthStackScreens = () => {
  return (
    // @ts-ignore
    <AuthStackNavigator.Navigator initialRouteName="Onboarding">
      {/* @ts-ignore  */}
      <AuthStackNavigator.Group screenOptions={{ headerShown: false }}>
        {/* @ts-ignore  */}
        <AuthStackNavigator.Screen name = 'Onboarding' component = {OnboardingScreen} />
        <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
        <AuthStackNavigator.Screen name="Register" component={RegisterScreen} />
        <AuthStackNavigator.Screen name="SetInterest" component={SetInterestScreen} />
      </AuthStackNavigator.Group>
    </AuthStackNavigator.Navigator>
  )
}

export default AuthStackScreens