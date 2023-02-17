import * as React from 'react'
import { Svg, Path } from 'react-native-svg'
import { Theme } from '../../theme'
import { useTheme } from '@shopify/restyle'

const HomeIcon = ({ variant }: { variant: 'filled' | 'outlined' }) => {
  const { colors } = useTheme<Theme>()

  if (variant === 'filled') {
    return (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.53989 2H7.91989C9.32989 2 10.4599 3.15 10.4599 4.561V7.97C10.4599 9.39 9.32989 10.53 7.91989 10.53H4.53989C3.13989 10.53 1.99989 9.39 1.99989 7.97V4.561C1.99989 3.15 3.13989 2 4.53989 2ZM4.53989 13.4697H7.91989C9.32989 13.4697 10.4599 14.6107 10.4599 16.0307V19.4397C10.4599 20.8497 9.32989 21.9997 7.91989 21.9997H4.53989C3.13989 21.9997 1.99989 20.8497 1.99989 19.4397V16.0307C1.99989 14.6107 3.13989 13.4697 4.53989 13.4697ZM19.46 2H16.08C14.67 2 13.54 3.15 13.54 4.561V7.97C13.54 9.39 14.67 10.53 16.08 10.53H19.46C20.86 10.53 22 9.39 22 7.97V4.561C22 3.15 20.86 2 19.46 2ZM16.08 13.4697H19.46C20.86 13.4697 22 14.6107 22 16.0307V19.4397C22 20.8497 20.86 21.9997 19.46 21.9997H16.08C14.67 21.9997 13.54 20.8497 13.54 19.4397V16.0307C13.54 14.6107 14.67 13.4697 16.08 13.4697Z"
          fill={colors.mainText}
        />
      </Svg>
    )
  }

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 6.5C3 3.87479 3.02811 3 6.5 3C9.97189 3 10 3.87479 10 6.5C10 9.12521 10.0111 10 6.5 10C2.98893 10 3 9.12521 3 6.5Z"
        stroke={colors.mainText}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14 6.5C14 3.87479 14.0281 3 17.5 3C20.9719 3 21 3.87479 21 6.5C21 9.12521 21.0111 10 17.5 10C13.9889 10 14 9.12521 14 6.5Z"
        stroke={colors.mainText}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 17.5C3 14.8748 3.02811 14 6.5 14C9.97189 14 10 14.8748 10 17.5C10 20.1252 10.0111 21 6.5 21C2.98893 21 3 20.1252 3 17.5Z"
        stroke={colors.mainText}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14 17.5C14 14.8748 14.0281 14 17.5 14C20.9719 14 21 14.8748 21 17.5C21 20.1252 21.0111 21 17.5 21C13.9889 21 14 20.1252 14 17.5Z"
        stroke={colors.mainText}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  )
}

export default HomeIcon
