import * as React from 'react'
import {
    ActivityIndicator,
    TextInput as RNTextInput,
    SafeAreaView,
    ScrollView,
    Pressable,
    useColorScheme,
} from 'react-native'
import { Text, TextInput, Button, Toast, Box } from '../../components'
import { useLoginMutation } from '../../api/authApi'
import { updateDetails } from '../../redux/slices/userSlice'
import { useAppDispatch } from '../../hooks/reduxhooks'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { Link, router } from 'expo-router'
import {
    EMAIL_VALIDATION_REGEX,
    HAS_OPENED_APP,
    USER_TOKEN_KEY,
} from '../../constants'
import useLocalStorage from '../../hooks/useLocalStorage'

export default function LoginScreen() {
    const [loginFormValues, setLoginFormValues] = React.useState({
        email: { value: 'jeremiahlena13@gmail.com', valid: true },
        password: { value: 'areyoukiddingme', valid: true },
    })

    const [login, { isLoading, data, isSuccess, error }] = useLoginMutation()

    const [, updateToken] = useLocalStorage<string>(USER_TOKEN_KEY)
    const [, updateHasOpenedApp] = useLocalStorage<boolean>(HAS_OPENED_APP)

    const dispatch = useAppDispatch()
    const isDarkMode = useColorScheme() === 'dark'

    const handleLogin = async () => {
        await login({
            email: loginFormValues.email.value,
            password: loginFormValues.password.value,
        })
    }

    React.useEffect(() => {
        if (isSuccess) {
            const user = {
                token: data?.data.token,
                email: data?.data.email,
                firstName: data?.data.first_name,
                lastName: data?.data.last_name,
            }

            updateHasOpenedApp(true)
            dispatch(updateDetails(user))

            if (user.token) updateToken(user.token)

            if (!data?.data.hasSetInterests) {
                router.replace('set-interest')
            } else {
                router.replace('(tabs)/news')
            }
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

                <Box flexDirection='row' justifyContent='flex-end' paddingTop='md'>
                    <Link href='auth/requestpasswordreset'>
                        <Text color="chocolate" textAlign="right" fontWeight="500">
                            Forgot Password?
                        </Text>
                    </Link>
                </Box>

                <Button
                    additionalStyles={{ marginTop: spacing.sm, borderRadius: 8 }}
                    variant={
                        loginFormValues.email.valid && loginFormValues.password.valid
                            ? 'contained'
                            : 'contained'
                    }
                    onPress={handleLogin}
                    loading={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text
                            fontSize={20}
                            fontFamily="Blatant"
                            letterSpacing={3}
                            textTransform="uppercase"
                            color={isDarkMode ? 'mainText' : 'mainBackground'}
                        >
                            Login
                        </Text>
                    )}
                </Button>

                <Box
                    flexDirection="row"
                    alignItems={'flex-end'}
                    justifyContent="center"
                    mt="xl"
                >
                    <Text color="chocolate" fontWeight="500">
                        New to ReadNews?
                    </Text>
                    <Link href='auth/register'>
                        <Text color="chocolate" fontWeight="500">
                            {' '}
                            Register
                        </Text>
                    </Link>
                </Box>

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
