import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthStackParamList } from './types'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'

const AuthStackNavigator = createNativeStackNavigator<AuthStackParamList>()

const AuthStackScreens = () => {
  return (
    // @ts-ignore
    <AuthStackNavigator.Navigator initialRouteName="Login">
      {/* @ts-ignore  */}
      <AuthStackNavigator.Group screenOptions={{ headerShown: false }}>
        {/* @ts-ignore  */}
        <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
        <AuthStackNavigator.Screen name="Register" component={RegisterScreen} />
      </AuthStackNavigator.Group>
    </AuthStackNavigator.Navigator>
  )
}

export default AuthStackScreens