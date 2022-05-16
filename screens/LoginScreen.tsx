import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { Box, Text } from '../components'
import { useLoginMutation } from '../api/authApi'
import { updateDetails } from '../redux/slices/userSlics'
import { useAppDispatch } from '../hooks/reduxhooks'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import PasswordIllustration from '../assets/illustrations/passwordillustration'

export default function LoginScreen() {
  const [loginFormValues, setLoginFormValues] = useState({
    email: 'jeremiahlena13@gmail.com',
    password: 'areyoukiddingme',
  })

  const navigation = useNavigation<NavigationProp<ReactNavigation.AuthParamList>>();

  const [login, { isLoading, data, isSuccess, error }] = useLoginMutation()
  const dispatch = useAppDispatch()

  const handleLogin = async () => {
    const res = await login(loginFormValues)
  }

  useEffect(() => {
    if (isSuccess) {
      const user = {
        token: data?.data.token,
        email: data?.data.email,
        firstName: data?.data.first_name,
        lastName: data?.data.last_name,
      }

      dispatch(updateDetails(user))

      navigation.navigate('Home')
    }
  }, [isSuccess])

  const { colors, spacing } = useTheme<Theme>()

  return (
    <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
      <ScrollView style={{ marginHorizontal: spacing.md, marginTop: 200 }}>
        <Text variant="heading1" color="mainText" textAlign="center">
          Login
        </Text>
        <TextInput
          style={styles.input}
          value={loginFormValues.email}
          keyboardType="email-address"
          onChangeText={(email) =>
            setLoginFormValues({ ...loginFormValues, email })
          }
        />

        <TextInput
          style={styles.input}
          value={loginFormValues.password}
          keyboardType="visible-password"
          onChangeText={(password) =>
            setLoginFormValues({ ...loginFormValues, password })
          }
        />

        <Button title="Login" onPress={handleLogin} />
        <Button
          title="Go to Register"
          onPress={() => navigation.navigate('Register')}
        />
        <PasswordIllustration />

        {isLoading && <ActivityIndicator />}
        {isSuccess && (
          <Text selectable>{JSON.stringify(data?.data, null, 3)}</Text>
        )}
        {error && (
          <Text selectable>{JSON.stringify(error?.data, null, 3)}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    width: '100%',
    backgroundColor: 'gray',
    marginVertical: 20,
    color: 'white',
    padding: 20,
    borderRadius: 8,
  },
})
