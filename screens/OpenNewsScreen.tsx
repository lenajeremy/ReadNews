import * as React from 'react'
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { Box, Text, BackButton } from '../components'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/types'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { BlurView } from 'expo-blur'

const OpenNewsScreen = ({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, 'OpenNews'>) => {
  const { colors } = useTheme<Theme>()
  const TOP_SCREEN_HEIGHT = Dimensions.get('window').height * 0.35
  return (
    <Box backgroundColor="mainBackground" flex={1}>
      <Box height={TOP_SCREEN_HEIGHT}>
        <ImageBackground
          source={{ uri: route.params?.img }}
          style={StyleSheet.absoluteFillObject}
        />
        <Box
          flexDirection="row"
          paddingHorizontal="lg"
          style={{ marginTop: 50 }}
        >
          <Box borderRadius={25} overflow="hidden">
            <BlurView intensity={100}>
              <BackButton
                pageName={route.params?.metadata.website as string}
                style={{ backgroundColor: colors.mainBackground + '55' }}
              />
            </BlurView>
          </Box>
        </Box>
      </Box>
      <Box flex = {1} backgroundColor = 'mainBackground' style = {{marginTop: -50}} borderRadius = {24} padding = 'lg'>
        <Text variant="heading1">{route.params?.title}</Text>
        <Text>{JSON.stringify(route.params, null, 3)}</Text>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: Dimensions.get('window').width,
  },
})

export default OpenNewsScreen
