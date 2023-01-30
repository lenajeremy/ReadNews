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

const BottomTab = createBottomTabNavigator<RootTabParamList>()

export default function BottomTabNavigator() {
  const { colors, spacing } = useTheme<Theme>()

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
            tabBarIcon: ({ focused, color }) => (
              // @ts-ignore
              <Feather name="menu" size={24} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="ExploreScreen"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              // @ts-ignore
              <Ionicons name="search-outline" size={24} color={color} />
            ),
          }}
        />

        <BottomTab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                // @ts-ignore
                <Ionicons name="ios-person" size={24} color={color} />
              ) : (
                // @ts-ignore
                <Ionicons name="ios-person-outline" size={24} color={color} />
              ),
          }}
        />
      </BottomTab.Group>
    </BottomTab.Navigator>
  )
}
