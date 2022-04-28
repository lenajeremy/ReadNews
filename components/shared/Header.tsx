import { useTheme } from '@shopify/restyle'
import React from 'react'
import { Image, StyleSheet } from 'react-native'
import Box from './Box'
import Text from './Text'
import { Theme } from '../../theme'
import Logo from './Logo'



export const Header: React.FC = () => {
  const { colors } = useTheme<Theme>()

  const styles = StyleSheet.create({
    profileDot: {
      backgroundColor: colors.primaryBlue,
      borderColor: colors.mainBackground,
      borderWidth: 1.5,
      width: 10,
      height: 10,
      borderRadius: 4,
      bottom: -1,
      right: -1,
      zIndex: 1,
    },
  })

  return (
    <Box
      height={60}
      alignItems="center"
      paddingHorizontal="lg"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box flexDirection="row" alignItems="center">
        <Logo
          width={30}
          height={30}
          strokeColor={colors.mainBackground}
          fillColor={colors.mainText}
        />
        <Text color="mainText" marginLeft="sm" fontSize={20}>
          ReadNews
        </Text>
      </Box>

      <Box position="relative">
        <Box position="absolute" style={styles.profileDot}></Box>
        <Image
          style={{ borderRadius: 20 }}
          width={25}
          height={25}
          source={{
            uri:
              'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwowsciencecamp.org%2Fwp-content%2Fuploads%2F2018%2F07%2Fdummy-user-img-1-800x800.png&f=1&nofb=1',
          }}
        />
      </Box>
    </Box>
  )
}

export default Header
