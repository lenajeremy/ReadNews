import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import * as React from 'react'
import {} from 'react-native'
import Box from './Box'

const CustomTabBar = (props: BottomTabBarProps) => {
  return (
    <Box backgroundColor="chocolate" width={'100%'} height = {50} borderRadius = {20}>
      {props.children}
    </Box>
  )
}

export default CustomTabBar;