import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  TextInput as RNTextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  DevSettings,
} from 'react-native'
import { Box, Text, TextInput, Button, Toast } from '../components'
import { useLoginMutation } from '../api/authApi'
import { updateDetails } from '../redux/slices/userSlice'
import { useAppDispatch } from '../hooks/reduxhooks'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { EMAIL_VALIDATION_REGEX } from '../constants'

export default function LoginScreen() {
  const [loginFormValues, setLoginFormValues] = useState({
    email: { value: 'jeremiahlena13@gmail.com', valid: false },
    password: { value: 'areyouthere', valid: false },
  })

  const navigation = useNavigation<
    NavigationProp<ReactNavigation.RootParamList>
  >()
  const authNavigation = useNavigation<
    NavigationProp<ReactNavigation.AuthParamList>
  >()

  const [login, { isLoading, data, isSuccess, error }] = useLoginMutation()
  const dispatch = useAppDispatch()

  const handleLogin = async () => {
    await login({
      email: loginFormValues.email.value,
      password: loginFormValues.password.value,
    })
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
      <ScrollView
        style={{ marginHorizontal: spacing.md, paddingTop: spacing.xl * 4 }}
        showsVerticalScrollIndicator={false}
      >
        <Text color="mainText" variant="heading1" mb={'lg'}>
          Login
        </Text>

        <TextInput
          additionalStyles={{
            marginBottom: spacing.xxs,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          value={loginFormValues.email.value}
          type="email"
          placeholder="Enter your email"
          onChangeText={(email, valid) =>
            setLoginFormValues({
              ...loginFormValues,
              email: { value: email, valid: !!valid },
            })
          }
          validate={(string) => EMAIL_VALIDATION_REGEX.test(string)}
        />

        <TextInput
          additionalStyles={{
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
          }}
          value={loginFormValues.password.value}
          type="password"
          placeholder="Enter your password"
          onChangeText={(password, valid) =>
            setLoginFormValues({
              ...loginFormValues,
              password: { value: password, valid: !!valid },
            })
          }
          validate={(string) => string.length >= 8}
        />

        <Pressable
          onPress={() => authNavigation.navigate('Register')}
          style={{
            justifyContent: 'center',
            marginTop: spacing.lg,
            marginBottom: spacing.sm,
          }}
        >
          <Text color="mainText" fontSize={16}>
            Don't have an account? Register
          </Text>
        </Pressable>

        <Button
          additionalStyles={{ marginTop: spacing.sm, borderRadius: 8 }}
          variant={
            loginFormValues.email.valid && loginFormValues.password.valid
              ? 'contained'
              : 'disabled'
          }
          onPress={handleLogin}
          loading={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text
              fontSize={24}
              fontFamily="Blatant"
              letterSpacing={2}
              textTransform="uppercase"
            >
              Login
            </Text>
          )}
        </Button>

        {isSuccess && (
          <Text selectable>{JSON.stringify(data?.data, null, 3)}</Text>
        )}
        {error && (
          <>
            <Toast type="error" message="Incorrect login credentials" />
            <Text selectable>{JSON.stringify(error, null, 3)}</Text>
          </>
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
