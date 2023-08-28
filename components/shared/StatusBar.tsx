import * as React from 'react'
import {
  StatusBar as RNStatusBar,
  StatusBarStyle,
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import useCurrentTheme from '../../hooks/useCurrentTheme'

interface StatusBarPrpos {
  backgroundColor?: string
  barStyle?: StatusBarStyle
}

const StatusBar = ({ backgroundColor, barStyle }: StatusBarPrpos) => {
  const isDarkMode = useCurrentTheme().asString === 'dark'
  const { colors } = useTheme<Theme>()

  return (
    <RNStatusBar
      barStyle={barStyle || isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundColor || colors.mainBackground}
    />
  )
}

export default StatusBar
