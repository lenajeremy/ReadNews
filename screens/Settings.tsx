import * as React from 'react'
import { Box, PressableWithHaptics, Text } from '../components'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Switch, Pressable } from 'react-native'
import { useTheme } from '@shopify/restyle'
import localStorage from '../utils/localStorage'
import { Theme } from '../theme'
import * as Updates from 'expo-updates'
import { BottomSheet, useBottomSheet } from '../contexts/BottomSheetContext'


const Settings = () => {

    const { colors } = useTheme<Theme>()
    const { bottomSheetRef } = useBottomSheet()

    const logout = function () {
        localStorage.clear()

        // logging out also has to invalidate the token from the backend
        Updates.reloadAsync()
    }

    return (
        <Box>
            <Box
                paddingHorizontal="md"
                paddingVertical="sm"
                style={{ backgroundColor: colors.bottomTabBarBackground + 80 }}
                borderRadius={12}
                marginBottom="xl"
            >
                <PressableWithHaptics onPress={() => bottomSheetRef.current?.expand()}>
                    <Box
                        paddingVertical="md"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        paddingHorizontal="sm"
                    >
                        <Box flexDirection="row" alignItems="center">
                            <MaterialCommunityIcons
                                name="theme-light-dark"
                                size={20}
                                color={colors.mainText}
                            />
                            <Text marginLeft={'md'} fontSize={16}>
                                Device Theme
                            </Text>
                        </Box>
                    </Box>
                </PressableWithHaptics>

                <Box
                    width={'100%'}
                    height={1}
                    backgroundColor="transparentBackground"
                />

                <Box
                    paddingVertical="md"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal="sm"
                >
                    <Box flexDirection="row" alignItems="center">
                        <Ionicons
                            name="notifications-outline"
                            size={20}
                            color={colors.mainText}
                        />
                        <Text marginLeft={'md'} fontSize={16}>
                            Notifications
                        </Text>
                    </Box>

                    <Switch
                        trackColor={{ true: colors.chocolate }}
                        value={false}
                    />
                </Box>

                <Box
                    width={'100%'}
                    height={1}
                    backgroundColor="transparentBackground"
                />

                <Box
                    paddingVertical="md"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal="sm"
                >
                    <Box flexDirection="row" alignItems="center">
                        <Ionicons
                            name="notifications-outline"
                            size={20}
                            color={colors.mainText}
                        />
                        <Text marginLeft={'md'} fontSize={16}>
                            Notifications
                        </Text>
                    </Box>

                    <Switch
                        trackColor={{ true: colors.chocolate }}
                        value={false}
                    />
                </Box>
            </Box>

            <Box
                paddingHorizontal="md"
                paddingVertical="sm"
                style={{ backgroundColor: colors.bottomTabBarBackground + 80 }}
                borderRadius={12}
            >
                <Pressable onPress={logout}>
                    <Box
                        paddingVertical="md"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        paddingHorizontal="sm"
                    >
                        <Box flexDirection="row" alignItems="center">
                            <Ionicons
                                name="log-out-outline"
                                size={20}
                                color={colors.error}
                            />
                            <Text marginLeft={'md'} fontSize={16} color="error">
                                Logout
                            </Text>
                        </Box>
                    </Box>
                </Pressable>

                <Box
                    width={'100%'}
                    height={1}
                    backgroundColor="transparentBackground"
                />

                <Box
                    paddingVertical="md"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal="sm"
                >
                    <Box flexDirection="row" alignItems="center">
                        <Ionicons
                            name="trash-bin-outline"
                            size={20}
                            color={colors.error}
                        />
                        <Text marginLeft={'md'} fontSize={16} color="error">
                            Delete Account
                        </Text>
                    </Box>
                </Box>
            </Box>

            <Box bottom={0} height={500} zIndex={1000} width={500}>
                <BottomSheet
                    snapPoints={['70%']}
                >
                    <Text>HEllo world</Text>
                </BottomSheet>
            </Box>
        </Box>
    )
}

export default Settings;