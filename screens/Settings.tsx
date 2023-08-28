import * as React from 'react'
import { Box, Button, PressableWithHaptics, Text } from '../components'
import { Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import { Switch, Pressable } from 'react-native'
import { useTheme } from '@shopify/restyle'
import localStorage from '../utils/localStorage'
import { Theme } from '../theme'
import * as Updates from 'expo-updates'
import { BottomSheet, useBottomSheet } from '../contexts/BottomSheetContext'
import useCurrentTheme, { DeviceTheme } from '../hooks/useCurrentTheme'


const Settings = () => {

    const { colors } = useTheme<Theme>()
    const bottomSheet = useBottomSheet()

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
                <PressableWithHaptics onPress={() => bottomSheet.openSheet(<BottomSheetContent />)}>
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
        </Box>
    )
}

const BottomSheetContent = () => {

    const { asString, setTheme } = useCurrentTheme()
    const { colors } = useTheme<Theme>()
    const [selectedTheme, setSelectedTheme] = React.useState<DeviceTheme>(asString)

    React.useEffect(() => setSelectedTheme(asString), [asString])

    return (
        <Box>
            <Box py='lg'>
                <PressableWithHaptics onPress={() => setSelectedTheme('light')}>
                    <Box flexDirection='row' my='sm' px='lg'>
                        <Feather name="sun" size={20} color={selectedTheme === 'light' ? colors.mainText : colors.mutedText} />
                        <Box pl='md'>
                            <Text color={selectedTheme === 'light' ? 'mainText' : 'mutedText'} fontSize={18}>Light Mode</Text>
                            <Text color={selectedTheme === 'light' ? 'mainText' : 'mutedText'}>This theme will activate when your system is set to light mode</Text>
                        </Box>
                    </Box>
                </PressableWithHaptics>

                <Box height={1} width={'100%'} backgroundColor={'lightGrayBackground'} my='sm' />

                <PressableWithHaptics onPress={() => setSelectedTheme('dark')}>
                    <Box flexDirection='row' my='sm' px='lg'>
                        <Ionicons name="moon-outline" size={20} color={selectedTheme === 'dark' ? colors.mainText : colors.mutedText} />
                        <Box pl='md'>
                            <Text color={selectedTheme === 'dark' ? 'mainText' : 'mutedText'} fontSize={18}>Dark Mode</Text>
                            <Text color={selectedTheme === 'dark' ? 'mainText' : 'mutedText'}>This theme will activate when your system is set to dark mode</Text>
                        </Box>
                    </Box>
                </PressableWithHaptics>

                <Box height={1} width={'100%'} backgroundColor={'lightGrayBackground'} my='sm' />

                <PressableWithHaptics onPress={() => setSelectedTheme('system')}>
                    <Box flexDirection='row' my='sm' px='lg'>
                        <SimpleLineIcons name="screen-desktop" size={20} color={selectedTheme === 'system' ? colors.mainText : colors.mutedText} />
                        <Box pl='md'>
                            <Text color={selectedTheme === 'system' ? 'mainText' : 'mutedText'} fontSize={18}>System</Text>
                            <Text color={selectedTheme === 'system' ? 'mainText' : 'mutedText'}>This theme will use the theme your system is using</Text>
                        </Box>
                    </Box>
                </PressableWithHaptics>
            </Box>
            <Box mx='lg'>
                <Button variant='contained' additionalStyles={{ height: 55 }} onPress={() => setTheme(selectedTheme)}>
                    <Text style={{ color: 'white' }}>Save Changes</Text>
                </Button>
            </Box>
        </Box>
    )
}

export default Settings;