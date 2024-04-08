import * as React from 'react'
import { ActivityIndicator, Dimensions, SafeAreaView } from 'react-native'
import { Text, Box, TextInput, Button } from '../../components'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { APP_LINKING_BASE_URL, EMAIL_VALIDATION_REGEX } from '../../constants'
import { useLazyRequestPasswordTokenQuery } from '../../api/authApi'



const RequestPasswordResetScreen = () => {
  const { spacing, colors } = useTheme<Theme>()
  const [email, setEmail] = React.useState<string>('')
  const [isValid, setIsValid] = React.useState<boolean>(false)
  const DEVICE_WIDTH = Dimensions.get('window').width

  const [
    requestPasswordReset,
    { isFetching, isError },
  ] = useLazyRequestPasswordTokenQuery()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
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
          Request Password Reset
        </Text>
        <TextInput
          additionalStyles={{
            marginBottom: spacing.xxs,
          }}
          value={email}
          type="email"
          placeholder="Enter your email"
          onChangeText={(email) => setEmail(email)}
          onValidate={(isValid) => setIsValid(isValid)}
          validate={(email) => EMAIL_VALIDATION_REGEX.test(email)}
        />
        <Button
          onPress={() =>
            requestPasswordReset({
              email,
              route: 'Auth/ResetPassword',
              host: APP_LINKING_BASE_URL,
            })
          }
          additionalStyles={{
            width: DEVICE_WIDTH - spacing.md * 2,
            marginTop: 10,
          }}
          variant={isValid ? 'contained' : 'disabled'}
          loading={isFetching}
        >
          {isFetching ? (
            <ActivityIndicator />
          ) : (
            <Text fontFamily="Blatant" fontSize={20} letterSpacing={3} style={{ color: 'white' }}>
              RESET PASSWORD
            </Text>
          )}
        </Button>
      </Box>
    </SafeAreaView>
  )
}

export default RequestPasswordResetScreen
