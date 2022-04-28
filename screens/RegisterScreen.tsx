import React, { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { Box, Text } from '../components'
import { useRegisterMutation } from '../api/authApi'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'

export default function LoginScreen({ navigation } : { navigation : any}) {
  const [registerFormValues, setRegisterFormValues] = useState({
    email: '',
    password: '',
    fullName: ''
  })

  const [register, { isLoading, data, isSuccess, error }] = useRegisterMutation()

  const { colors, spacing } = useTheme<Theme>()

  const handleLogin = async () => {
    const res = await register(registerFormValues)

    console.log(res)

    if (isSuccess) {
      navigation.navigate('Login')
    }
  }


  return (
    <SafeAreaView style = {{flex: 1, backgroundColor: colors.mainBackground}}>
      <ScrollView style = {{marginHorizontal: spacing.md, marginTop: 200}}>

          <Text color = 'mainText' textAlign='center' variant='heading1'>Register</Text>
        <TextInput
          style={styles.input}
          value={registerFormValues.email}
          keyboardType="email-address"
          onChangeText={(email) =>
            setRegisterFormValues({ ...registerFormValues, email })
          }
        />

        <TextInput
          style={styles.input}
          value={registerFormValues.fullName}
          onChangeText={(fullName) =>
            setRegisterFormValues({ ...registerFormValues, fullName })
          }
        />

        <TextInput
          style={styles.input}
          value={registerFormValues.password}
          keyboardType="visible-password"
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
