import * as React from 'react'
import { Svg, Path, Circle } from 'react-native-svg'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'

const SearchIcon = ({ variant }: { variant: 'outlined' | 'filled' }) => {
  const { colors } = useTheme<Theme>()

  if (variant === 'filled') {
    return (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2 10.6699C2 5.88166 5.84034 2 10.5776 2C12.8526 2 15.0343 2.91344 16.6429 4.53936C18.2516 6.16529 19.1553 8.37052 19.1553 10.6699C19.1553 15.4582 15.3149 19.3399 10.5776 19.3399C5.84034 19.3399 2 15.4582 2 10.6699ZM19.0134 17.6543L21.568 19.7164H21.6124C22.1292 20.2388 22.1292 21.0858 21.6124 21.6082C21.0955 22.1306 20.2576 22.1306 19.7407 21.6082L17.6207 19.1785C17.4203 18.9766 17.3076 18.7024 17.3076 18.4164C17.3076 18.1304 17.4203 17.8562 17.6207 17.6543C18.0072 17.2704 18.6268 17.2704 19.0134 17.6543Z"
          fill={colors.mainText}
        />
      </Svg>
    )
  }

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle
        cx="11.7666"
        cy="11.7666"
        r="8.98856"
        stroke={colors.mainText}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M18.0183 18.4851L21.5423 22"
        stroke={colors.mainText}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  )
}

export default SearchIcon;