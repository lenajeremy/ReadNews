import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTheme } from '@shopify/restyle'
import * as React from 'react'
import {
  ActivityIndicator,
  Button,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native'
import { Box, Text } from '../components'
import { Theme } from '../theme'

const ResetPasswordScreen = ({ route } : StackScreenProps<ReactNavigation.AuthParamList>) => {
  const { spacing, colors } = useTheme<Theme>()
  const [email, setEmail] = React.useState<string>('')
  const [isValid, setIsValid] = React.useState<boolean>(false)
  const DEVICE_WIDTH = Dimensions.get('window').width

  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <Box
        backgroundColor="mainBackground"
        flex={1}
        px="md"
        style={{ marginTop: spacing.lg * 3 }}
      >
        <Text>{JSON.stringify(route.params)}</Text>
        <Text
          color="mainText"
          variant="heading1"
          style={{ marginBottom: spacing.lg * 1.5 }}
        >
          ResetPassword
        </Text>
      </Box>
    </SafeAreaView>
  )
}

export default ResetPasswordScreen
