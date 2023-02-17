/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import * as React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ExploreScreen, NewsScreen, ProfileScreen } from '../screens'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { RootTabParamList } from './types'
import { Platform } from 'react-native'
import { useColorScheme } from 'react-native'
import HomeIcon from '../assets/illustrations/homeicon'
import SearchIcon from '../assets/illustrations/searchicon'
import ProfileIcon from '../assets/illustrations/profileicon'

const BottomTab = createBottomTabNavigator<RootTabParamList>()

export default function BottomTabNavigator() {
  const { colors, spacing } = useTheme<Theme>()
  const isDark = useColorScheme() === 'dark'

  return (
    // @ts-ignore
    <BottomTab.Navigator
      initialRouteName="NewsScreen"
      screenOptions={{
        tabBarStyle: {
          alignItems: 'center',
          height: 80,
          position: 'absolute',
          bottom: 40,
          borderRadius: 16,
          marginHorizontal: spacing.lg,
          paddingVertical: Platform.OS === 'ios' ? 28 : 0,
          elevation: 0,
          borderTopWidth: 0,
          flexDirection: 'column',
          backgroundColor: isDark ? '#222' : 'white',
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: colors.mainText,
      }}
    >
      {/* @ts-ignore */}
      <BottomTab.Group screenOptions={{ headerShown: false }}>
        <BottomTab.Screen
          name="NewsScreen"
          component={NewsScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <HomeIcon variant="filled" />
              ) : (
                <HomeIcon variant="outlined" />
              ),
          }}
        />
        <BottomTab.Screen
          name="ExploreScreen"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <SearchIcon variant="filled" />
              ) : (
                <SearchIcon variant="outlined" />
              ),
          }}
        />

        <BottomTab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <ProfileIcon variant="filled" />
              ) : (
                <ProfileIcon variant="outlined" />
              ),
          }}
        />
      </BottomTab.Group>
    </BottomTab.Navigator>
  )
}
