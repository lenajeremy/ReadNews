/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { FontAwesome } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NewsScreen } from '../screens'

export type RootTabParamList = {
  NewsScreen: undefined
}


const BottomTab = createBottomTabNavigator<RootTabParamList>()

export default function BottomTabNavigator() {
  return (
    // @ts-ignore
    <BottomTab.Navigator initialRouteName="NewsScreen">
      <BottomTab.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{
          title: 'Tab Two',
          // @ts-ignore
          tabBarIcon: ({ color }) => <FontAwesome name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  )
}
