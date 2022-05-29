import React, { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { Box, Text, TextInput } from '../components'
import { useRegisterMutation } from '../api/authApi'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [registerFormValues, setRegisterFormValues] = useState({
    email: '',
    password: '',
    fullName: '',
  })

  const [
    register,
    { isLoading, data, isSuccess, error },
  ] = useRegisterMutation()

  const { colors, spacing } = useTheme<Theme>()

  const handleLogin = async () => {
    const res = await register(registerFormValues)

    console.log(res)

    if (isSuccess) {
      navigation.navigate('Login')
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <ScrollView
        style={{ marginHorizontal: spacing.md, paddingTop: spacing.xl * 4 }}
      >
        <Text color="mainText" variant="heading1" mb = {'xl'}>
          Register
        </Text>
        <TextInput
        placeholder='Enter your email'
          additionalStyles={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          value={registerFormValues.email}
          type="email"
          onChangeText={(email) =>
            setRegisterFormValues({ ...registerFormValues, email })
          }
        />

        <TextInput
        placeholder='Enter your full name'
          additionalStyles={{ marginVertical: spacing.xxs, borderRadius: 0 }}
          type="text"
          value={registerFormValues.fullName}
          onChangeText={(fullName) =>
            setRegisterFormValues({ ...registerFormValues, fullName })
          }
        />

        <TextInput
        placeholder='Enter your password'
          additionalStyles={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          value={registerFormValues.password}
          type="password"
          onChangeText={(password) =>
            setRegisterFormValues({ ...registerFormValues, password })
          }
        />

        <Button title="Register" onPress={handleLogin} />
        <Button
          title="Go to Login"
          onPress={() => navigation.navigate('Login')}
        />

        {isLoading && <ActivityIndicator />}
        {isSuccess && <Text>{JSON.stringify(data, null, 3)}</Text>}
        {error && <Text>{JSON.stringify(error, null, 3)}</Text>}
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
    borderRadius: 8,
    padding: 20,
  },
})
