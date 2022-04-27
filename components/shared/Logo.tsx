// @ts-nocheck

import React from 'react'
import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from 'react-native-svg'

interface LogoProps {
  width?: number
  height?: number
  fillColor?: string
  strokeColor?: string
}

export const Logo: React.FC<LogoProps> = ({
  width,
  height,
  fillColor,
  strokeColor,
}) => {
  return (
    <Svg
      width={width?.toString() || '100'}
      height={height?.toString() || '100'}
      viewBox="0 0 100 100"
      fill="none"
    >
      <G clipPath="url(#clip0_8_9)">
        <Circle cx="50" cy="50" r="50" fill={fillColor || '#1B2528'} />
        <Circle
          cx="50"
          r="50"
          stroke={strokeColor || 'white'}
          strokeWidth="4"
        />
        <Circle r="50" stroke={strokeColor || 'white'} strokeWidth="4" />
        <Circle
          cy="50"
          r="50"
          stroke={strokeColor || 'white'}
          strokeWidth="4"
        />
        <Circle
          cy="100"
          r="50"
          stroke={strokeColor || 'white'}
          strokeWidth="4"
        />
        <Circle
          cx="50"
          cy="100"
          r="50"
          stroke={strokeColor || 'white'}
          strokeWidth="4"
        />
        <Circle
          cx="100"
          cy="100"
          r="50"
          stroke={strokeColor || 'white'}
          strokeWidth="4"
        />
        <Circle
          cx="100"
          cy="50"
          r="50"
          stroke={strokeColor || 'white'}
          strokeWidth="4"
        />
        <Circle
          cx="100"
          r="50"
          stroke={strokeColor || 'white'}
          strokeWidth="4"
        />
        <Path
          d="M210.678 126.338C211.417 125.963 211.712 125.061 211.338 124.322L205.235 112.28C204.86 111.541 203.958 111.246 203.219 111.62C202.48 111.995 202.184 112.898 202.559 113.637L207.984 124.34L197.28 129.765C196.541 130.14 196.246 131.042 196.62 131.781C196.995 132.52 197.898 132.816 198.637 132.441L210.678 126.338ZM99.5334 90.4256L209.533 126.426L210.467 123.574L100.467 87.5744L99.5334 90.4256Z"
          fill="black"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_8_9">
          <Rect width="100" height="100" rx="50" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default Logo
