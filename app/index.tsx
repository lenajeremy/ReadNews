import * as React from 'react'
import { Box, PressableWithHaptics, Text } from '../components'
import { router, usePathname } from 'expo-router'
import { ActivityIndicator, SafeAreaView, useWindowDimensions } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import useLocalStorage from '../hooks/useLocalStorage'
import { USER_TOKEN_KEY } from '../constants'
import { useLazyLoginWithTokenQuery } from '../api/authApi'
import { useAppDispatch, useAppSelector } from '../hooks/reduxhooks'
import { updateDetails } from '../redux/slices/userSlice'
import { Ionicons } from '@expo/vector-icons'


export default function Index() {
    const { colors } = useTheme<Theme>()
    const { height } = useWindowDimensions()
    const [token, updateToken, isLoadingToken, clear] = useLocalStorage<string>(
        USER_TOKEN_KEY,
    )

    const [hasRendered, setHasRendered] = React.useState(false)
    const [loginWithToken, { isFetching, isError }] = useLazyLoginWithTokenQuery()

    const dispatch = useAppDispatch()
    const state = useAppSelector(store => store.user)

    React.useEffect(() => {
        async function login() {
            try {
                if (token && typeof token === 'string') {
                    const res = await loginWithToken(token).unwrap()
                    dispatch(
                        updateDetails({
                            token: res.data.token,
                            email: res.data.email,
                            lastName: res.data.last_name,
                            firstName: res.data.first_name,
                        }),
                    )
                }
            } catch (error) {
                console.log("an error occurred", error)
                // updateToken(undefined)
            }
        }

        login()
        setHasRendered(true)
        // clear()
    }, [])

    React.useEffect(() => {
        console.log(state, token)
        if (hasRendered) {
            console.log('has rendered and should replace auth')
            router.replace('auth')
            console.log('replace auth')
        }
    }, [hasRendered, state, token])

    if (isError) {
        return (
            <Box backgroundColor='mainBackground' alignItems='center' height={height} justifyContent='center'>
                <Text>{'Awww... An error occured'}</Text>
                <PressableWithHaptics onPress={() => loginWithToken(token as string)}>
                    <Text>
                        Retry
                    </Text>
                </PressableWithHaptics>
            </Box>
        )
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.mainBackground,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator />
        </SafeAreaView>
    )
}