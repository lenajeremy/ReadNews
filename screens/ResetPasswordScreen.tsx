import { NavigationProp, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTheme } from '@shopify/restyle'
import * as React from 'react'
import { ActivityIndicator, Dimensions, SafeAreaView, Alert } from 'react-native'
import { useResetPasswordMutation } from '../api/authApi'
import { Box, Text, TextInput, Button } from '../components'
import { Theme } from '../theme'

const ResetPasswordScreen = ({
  route,
}: StackScreenProps<ReactNavigation.AuthParamList>) => {
  const { spacing, colors } = useTheme<Theme>()
  const [newPassword, setNewPassword] = React.useState<string>('')
  const [confirmNewPassword, setConfirmNewPassword] = React.useState<string>('')
  const [isValid, setIsValid] = React.useState<boolean>(false)
  const DEVICE_WIDTH = Dimensions.get('window').width

  const [
    resetPassword,
    { isLoading, isError, isSuccess },
  ] = useResetPasswordMutation()

  const navigation = useNavigation<
    NavigationProp<ReactNavigation.AuthParamList>
  >()

  const _resetPassword = React.useCallback(async () => {
    try {
      const res = await resetPassword({
        newPassword,
        confirmNewPassword,
        userId: route.params?.userId as string,
        resetPasswordToken: route.params?.passwordResetToken as string,
      }).unwrap()

      console.log(res)

      if (Boolean(res)) {
        Alert.alert('Message', JSON.stringify(res))
        navigation.navigate('Login')
      }
    } catch (error) {}
  }, [confirmNewPassword, newPassword])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
        <Text>{JSON.stringify(route.params)}</Text>
      <Box
        backgroundColor="mainBackground"
        flex={1}
        px="md"
        style={{ marginTop: spacing.lg * 3 }}
      >
        <Text
          color="mainText"
          variant="heading1"
          style={{ marginBottom: spacing.lg * 1.5 }}
        >
          Reset Password
        </Text>
        <TextInput
          additionalStyles={{
            marginBottom: spacing.xxs,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          value={newPassword}
          type="password"
          placeholder="Enter new password"
          onChangeText={(password) => setNewPassword(password)}
          onValidate={(isValid) => setIsValid(isValid)}
          validate={(password) =>
            password.length > 8 && password === confirmNewPassword
          }
        />
        <TextInput
          additionalStyles={{
            marginBottom: spacing.xxs,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          value={confirmNewPassword}
          type="password"
          placeholder="Confirm password"
          onChangeText={(password) => setConfirmNewPassword(password)}
          onValidate={(isValid) => setIsValid(isValid)}
          validate={(password) =>
            password.length > 8 && password === newPassword
          }
        />
        <Button
          onPress={_resetPassword}
          additionalStyles={{
            width: DEVICE_WIDTH - spacing.md * 2,
            height: 60,
            marginTop: 10,
          }}
          variant={true ? 'contained' : 'disabled'}
          loading={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text fontFamily="Blatant" fontSize={24} style={{ color: 'white' }}>
              RESET PASSWORD
            </Text>
          )}
        </Button>
      </Box>
    </SafeAreaView>
  )
}

export default ResetPasswordScreen
