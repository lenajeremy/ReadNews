import * as React from 'react'
import {
  StatusBar as RNStatusBar,
  StatusBarStyle,
  useColorScheme,
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import useCurrentTheme from '../../hooks/useCurrentTheme'

interface StatusBarPrpos {
  backgroundColor?: string
  barStyle?: StatusBarStyle
}

const StatusBar = ({ backgroundColor, barStyle }: StatusBarPrpos) => {
  const currentTheme = useCurrentTheme().asString
  const colorScheme = useColorScheme()
  const { colors } = useTheme<Theme>()

  const getStatusBarColor = () => {
    switch (currentTheme) {
      case 'dark':
        return 'light-content'
      case 'light':
        return 'dark-content'
      default:
        return colorScheme === 'dark' ? 'light-content' : 'dark-content'
    }
  }

  return (
    <RNStatusBar
      barStyle={barStyle || getStatusBarColor()}
      backgroundColor={backgroundColor || colors.mainBackground}
    />
  )
}

export default StatusBar
