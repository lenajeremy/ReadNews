import * as React from 'react'
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native'
import { Box, Text, BackButton, ErrorBoundary } from '../components'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/types'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { BlurView } from 'expo-blur'
import { RenderMdx } from 'rn-mdx'
import { useGetNewsContentQuery } from '../api/newsApi'
import { NewsViewMode } from '../types'
import WebView from 'react-native-webview'

const OpenNewsScreen = ({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, 'OpenNews'>) => {
  const { colors, spacing } = useTheme<Theme>()
  const TOP_SCREEN_HEIGHT = Dimensions.get('window').height * 0.3
  const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get(
    'window',
  )

  const {
    data: newsContent = '',
    isFetching,
    isError,
  } = useGetNewsContentQuery(route.params?.url || '')

  const [renderMdxError, setRenderMdxError] = React.useState<boolean>(false)
  const [viewMode, setViewMode] = React.useState<NewsViewMode>(NewsViewMode.MDX)

  React.useEffect(() => {
    if (isError) setViewMode(NewsViewMode.WEBVIEW)
  }, [isError])

  return (
    <ScrollView style={{ backgroundColor: colors.mainBackground }}>
      <Box flex={1}>
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

          {isFetching && (
            <Box
              flex={1}
              height={DEVICE_HEIGHT * 0.5}
              alignItems="center"
              justifyContent="center"
            >
              <ActivityIndicator />
            </Box>
          )}

          <Box flex={1} backgroundColor="mainBackground">
            <ErrorBoundary onError={() => setViewMode(NewsViewMode.WEBVIEW)}>
              {viewMode === NewsViewMode.MDX ? (
                <RenderMdx
                  componentStyle={{
                    root: {
                      backgroundColor: colors.mainBackground,
                    },
                    img: {
                      width: DEVICE_WIDTH - spacing.lg * 2,
                      height: 250,
                      backgroundColor: 'gray',
                    },
                    listUnorderedItemText: {
                      fontSize: 18,
                      lineHeight: 30,
                    },
                    inline: {
                      fontSize: 18,
                      lineHeight: 30,
                    },
                    blockquote: {
                      borderLeftColor: colors.mutedText,
                      paddingLeft: 16,
                      borderLeftWidth: 4,
                      backgroundColor: colors.transparentBackground,
                    },
                    codeBlock: {
                      fontFamily: 'Courier',
                      padding: 8,
                      fontSize: 14,
                    },
                    codeBlockContainer: {
                      padding: 4,
                      backgroundColor: colors.transparentBackground,
                      width: '100%',
                      minHeight: 50,
                    },
                    paragraphText: {
                      fontSize: 18,
                      lineHeight: 30,
                    },
                    text: {
                      fontSize: 18,
                      lineHeight: 30,
                      color: colors.mainText,
                    },
                    link: { marginTop: -3 },
                    linkLabel: {
                      fontSize: 18,
                      lineHeight: 30,
                      color: colors.primaryBlue,
                    },
                    listOrderedItemIcon: {
                      marginRight: 10,
                      height: '100%',
                      justifyContent: 'center',
                    },
                    // listOrderItemIconText: {
                    //   fontSize: 18,
                    //   lineHeight: 30,
                    // },
                    listOrderedItem: {
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                    },
                  }}
                >
                  {newsContent}
                </RenderMdx>
              ) : (
                <WebView
                  style={{ width: DEVICE_WIDTH, height: 500 }}
                  source={{ uri: route.params?.url as string }}
                />
              )}
            </ErrorBoundary>
          </Box>
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
