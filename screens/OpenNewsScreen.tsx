import * as React from 'react'
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native'
import { Box, Text, BackButton } from '../components'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/types'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { BlurView } from 'expo-blur'
import { RenderMdx } from 'rn-mdx'
import { useGetNewsContentQuery } from '../api/newsApi'

const OpenNewsScreen = ({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, 'OpenNews'>) => {
  const { colors, spacing } = useTheme<Theme>()
  const TOP_SCREEN_HEIGHT = Dimensions.get('window').height * 0.35
  const { width: DEVICE_WIDTH } = Dimensions.get('window')
  const isDarkMode = useColorScheme() === 'dark'

  const { data: newsContent = '', isFetching } = useGetNewsContentQuery(
    route.params?.url || '',
  )

  return (
    <ScrollView>
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
              <BlurView intensity={50}>
                <BackButton
                  pageName={route.params?.metadata.website as string}
                  style={{ backgroundColor: colors.mainBackground + '55' }}
                />
              </BlurView>
            </Box>
          </Box>
        </Box>
        <Box
          flex={1}
          backgroundColor="mainBackground"
          style={{ marginTop: -50 }}
          borderRadius={24}
          padding="lg"
        >
          <Text
            variant="heading2"
            mb="md"
            style={{ width: '95%' }}
            lineHeight={34}
          >
            {route.params?.title}
          </Text>
          <RenderMdx
            componentStyle={{
              img: {
                width: DEVICE_WIDTH - spacing.lg * 2,
                height: 250,
                backgroundColor: 'gray',
              },
              blockquote: {
                borderLeftColor: colors.mutedText,
                paddingLeft: 16,
                borderLeftWidth: 4,
                backgroundColor: isDarkMode ? '#3337' : '#FFF3',
              },
              paragraphText: { fontSize: 18, lineHeight: 30 },
              text: { fontSize: 18, lineHeight: 30, color: colors.mainText },
              link: { marginTop: -3 },
              linkLabel: {
                fontSize: 16,
                lineHeight: 30,
                color: colors.chocolate,
              },
            }}
          >
            {newsContent}
          </RenderMdx>
        </Box>
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: Dimensions.get('window').width,
  },
})

export default OpenNewsScreen
