import React from 'react'
import { Tabs } from 'expo-router'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import HomeIcon from '../../assets/illustrations/homeicon'
import SearchIcon from '../../assets/illustrations/searchicon'
import ProfileIcon from '../../assets/illustrations/profileicon'
import { Platform } from 'react-native';


export default function TabLayout() {
    const { colors, spacing } = useTheme<Theme>()
    return (
        <Tabs
            initialRouteName="NewsScreen"
            screenOptions={{
                tabBarStyle: {
                    alignItems: 'center',
                    height: 60,
                    position: 'absolute',
                    bottom: 30,
                    borderRadius: 12,
                    marginHorizontal: spacing.lg,
                    paddingBottom: 0,
                    elevation: 0,
                    borderTopWidth: 0,
                    flexDirection: 'column',
                    backgroundColor: colors.bottomTabBarBackground,
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primaryBlue,
                tabBarInactiveTintColor: colors.mainText,
                headerShown: false
            }}
        >
            <Tabs.Screen
                name="news"
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <HomeIcon variant="filled"  />
                        ) : (
                            <HomeIcon variant="outlined" />
                        ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <SearchIcon variant="filled" />
                        ) : (
                            <SearchIcon variant="outlined" />
                        ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <ProfileIcon variant="filled" />
                        ) : (
                            <ProfileIcon variant="outlined" />
                        ),
                }}
            />
        </Tabs>

    );
}