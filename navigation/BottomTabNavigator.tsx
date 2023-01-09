/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Feather, Foundation, Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ExploreScreen, NewsScreen, ProfileScreen } from '../screens'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { RootTabParamList } from './types'
import { CustomTabBar } from '../components'

const BottomTab = createBottomTabNavigator<RootTabParamList>()

export default function BottomTabNavigator() {
  const { colors, spacing } = useTheme<Theme>()

  return (
    // @ts-ignore
    <BottomTab.Navigator
      initialRouteName="ProfileScreen"
      // tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          height: 80,
          position: 'absolute',
          bottom: 40,
          borderRadius: 16,
          marginHorizontal: spacing.lg,
          paddingTop: 24,
          // backgroundColor: colors.mainText,
          borderTopWidth: 0,
          flexDirection: 'column',
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.chocolate,
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
