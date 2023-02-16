import * as React from 'react'
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Share,
  ShareAction,
  Pressable,
} from 'react-native'
import {
  Box,
  Text,
  BackButton,
  ErrorBoundary,
  PressableWithHaptics,
} from '../components'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/types'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { BlurView } from 'expo-blur'
import { RenderMdx } from 'rn-mdx'
import {
  useGetNewsContentQuery,
  useRegisterInteractionMutation,
} from '../api/newsApi'
import { NewsViewMode } from '../types'
import WebView from 'react-native-webview'
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import Reanimated from 'react-native-reanimated'
import { useColorScheme } from 'react-native'
import { generateNewLinkToShare } from '../utils'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const AnimatedBox = Reanimated.createAnimatedComponent(Box)
const AnimatedText = Reanimated.createAnimatedComponent(Text)

const OpenNewsScreen = ({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, 'OpenNews'>) => {
  const { colors, spacing } = useTheme<Theme>()
  const TOP_SCREEN_HEIGHT = Dimensions.get('window').height * 0.2
  const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get(
    'window',
  )

  const isDarkMode = useColorScheme() === 'dark'

  const { data, isFetching, isLoading, isError } = useGetNewsContentQuery(
    route.params?.url || '',
  )

  const [renderMdxError, setRenderMdxError] = React.useState<boolean>(false)
  const [viewMode, setViewMode] = React.useState<NewsViewMode>(NewsViewMode.MDX)

  const scrollPosition = useSharedValue<number>(0)

  const opacityValue = useDerivedValue(() =>
    scrollPosition.value < 0
      ? interpolate(
          scrollPosition.value,
          [-400, 0],
          [0.8, 0],
          Extrapolate.CLAMP,
        )
      : interpolate(scrollPosition.value, [0, 100], [0, 1], Extrapolate.CLAMP),
  )

  const heightValue = useDerivedValue(() =>
    scrollPosition.value < 0
      ? TOP_SCREEN_HEIGHT - scrollPosition.value
      : interpolate(
          scrollPosition.value,
          [0, 100],
          [TOP_SCREEN_HEIGHT, 100],
          Extrapolate.CLAMP,
        ),
  )

  const scrollViewMargin = useDerivedValue(() =>
    interpolate(
      scrollPosition.value,
      [0, 100],
      [TOP_SCREEN_HEIGHT, 100],
      Extrapolate.CLAMP,
    ),
  )

  const scrollViewAnimatedStyle = useAnimatedStyle(() => ({
    marginTop: scrollViewMargin.value,
  }))

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }))

  const heightStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }))

  const animatedTitleValues = useDerivedValue(() => {
    return {
      opacity:
        heightValue.value > TOP_SCREEN_HEIGHT
          ? 0
          : interpolate(
              heightValue.value,
              [150, 100],
              [0, 1],
              Extrapolate.CLAMP,
            ),
      translateY: interpolate(
        heightValue.value,
        [150, 100],
        [125, 0],
        Extrapolate.CLAMP,
      ),
    }
  })

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: animatedTitleValues.value.opacity,
    transform: [{ translateY: animatedTitleValues.value.translateY }],
  }))

  React.useEffect(() => {
    if (isError) setViewMode(NewsViewMode.WEBVIEW)
  }, [isError])

  const [registerInteraction] = useRegisterInteractionMutation()
  const [isLiked, setLiked] = React.useState<boolean>(false)
  const [isSaved, setSaved] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (data) {
      setLiked(data.isLiked || false)
      setSaved(data.isSaved || false)

      if (!data.text) {
        setViewMode(NewsViewMode.WEBVIEW)
      }
    }
  }, [data])

  const share = React.useCallback(async () => {
    await Haptics.impactAsync()

    const newLinkToShare = generateNewLinkToShare(
      route.params.title as string,
      route.params.url as string,
      route.params.img as string,
      route.params.website as string,
      route.params.favicon as string,
      navigation.getState().routeNames[
        navigation.getState().routeNames.length - 1
      ],
    )

    // const textToShare = `Hey... I felt to share this news with you. Read on the *ReadNews* app here: \n ${newLinkToShare}`

    const shareAction = await Share.share(
      {
        title: 'Share',
        message: newLinkToShare,
      },
      {
        dialogTitle: 'hello',
        subject: 'this is the subject',
        tintColor: colors.chocolate,
      },
    )

    if (shareAction.action === Share.sharedAction) {
      const res = await registerInteraction({
        url: route.params.url,
        action: 'SHARE',
        effect: 'POSITIVE',
      })
      console.log(res)
    }
  }, [])

  const like = React.useCallback(async () => {
    try {
      const res = await registerInteraction({
        url: route.params.url,
        action: 'LIKE',
        effect: isLiked ? 'NEGATIVE' : 'POSITIVE',
      })

      if (res) {
        setLiked(!isLiked)
      }
    } catch (error) {}
  }, [isLiked])

  const save = React.useCallback(async () => {
    try {
      const res = await registerInteraction({
        url: route.params.url,
        action: 'SAVE',
        effect: isLiked ? 'NEGATIVE' : 'POSITIVE',
      })

      if (res) {
        setSaved(!isSaved)
      }
    } catch (error) {}
  }, [isSaved])

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <AnimatedBox style={heightStyle} position="absolute" width={'100%'}>
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
                pageName={route.params?.website as string}
                style={{ backgroundColor: colors.mainBackground + '55' }}
              />
            </BlurView>
          </Box>
        </Box>

        <AnimatedBox
          style={[
            StyleSheet.absoluteFillObject,
            animatedStyle,
            { paddingTop: 40 },
          ]}
          backgroundColor={isDarkMode ? 'chocolate' : 'blue200'}
          px="lg"
          pointerEvents={'none'}
        >
          <Box height={60} alignItems="center" justifyContent="center">
            <AnimatedText
              fontSize={20}
              fontFamily="Blatant"
              style={[{ width: '80%' }, animatedTitleStyle]}
              ellipsizeMode="tail"
              numberOfLines={1}
              textAlign="center"
            >
              {route.params?.title}
            </AnimatedText>
          </Box>
        </AnimatedBox>
      </AnimatedBox>

      <Reanimated.ScrollView
        onScroll={(e) => (scrollPosition.value = e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        style={scrollViewAnimatedStyle}
      >
        <Box
          flex={1}
          backgroundColor="mainBackground"
          paddingHorizontal={viewMode === NewsViewMode.MDX ? 'lg' : 'xxs'}
          paddingVertical="lg"
        >
          {viewMode == NewsViewMode.MDX && (
            <Text
              variant="heading2"
              mb="md"
              style={{ width: '95%' }}
              lineHeight={34}
            >
              {route.params?.title}
            </Text>
          )}
          <PressableWithHaptics
            onPress={() => setViewMode(viewMode == NewsViewMode.WEBVIEW ? NewsViewMode.MDX : NewsViewMode.WEBVIEW)}
          >
            <Text>Open as {viewMode == NewsViewMode.MDX ? 'web page' : 'text'} </Text>
          </PressableWithHaptics>

          {isLoading && (
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
                      height: 200,
                      backgroundColor: 'gray',
                    },
                    listUnorderedItemText: {
                      fontSize: 17,
                      lineHeight: 32,
                    },
                    inline: {
                      fontSize: 17,
                      lineHeight: 32,
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
                    heading: {
                      fontFamily: 'Blatant',
                    },
                    // @ts-ignore
                    codeBlockContainer: {
                      padding: 4,
                      backgroundColor: colors.transparentBackground,
                      width: '100%',
                      minHeight: 50,
                    },
                    paragraphText: {
                      fontSize: 17,
                      lineHeight: 32,
                    },
                    text: {
                      fontSize: 17,
                      lineHeight: 32,
                      color: colors.mainText,
                      // fontWeight: '500',
                    },
                    link: { marginTop: -3 },
                    linkLabel: {
                      fontSize: 17,
                      lineHeight: 32,
                      color: colors.primaryBlue,
                    },
                    listOrderedItemIcon: {
                      marginRight: 10,
                      height: '100%',
                      justifyContent: 'center',
                    },
                    // listOrderItemIconText: {
                    //   fontSize: 16,
                    //   lineHeight: 30,
                    // },
                    listOrderedItem: {
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                    },
                  }}
                >
                  {data?.text}
                </RenderMdx>
              ) : (
                <WebView
                  incognito={true}
                  cacheEnabled={false}
                  style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
                  source={{ uri: route.params?.url as string }}
                />
              )}
            </ErrorBoundary>
          </Box>
        </Box>
      </Reanimated.ScrollView>

      <AnimatedBox
        backgroundColor={'transparentBackground'}
        px="lg"
        alignItems={'center'}
        justifyContent="space-around"
        style={[{ height: 90 }]}
        flexDirection="row"
        paddingBottom={'lg'}
        borderTopColor={'mutedText'}
        borderTopWidth={1.5}
      >
        <PressableWithHaptics style={{ padding: 20 }} onPress={like}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? colors.primaryBlue : colors.mainText}
          />
        </PressableWithHaptics>
        <PressableWithHaptics style={{ padding: 20 }} onPress={save}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? colors.primaryBlue : colors.mainText}
          />
        </PressableWithHaptics>
        <Pressable onPress={share} style={{ padding: 20 }}>
          <Ionicons name="share-outline" size={24} color={colors.mainText} />
        </Pressable>
      </AnimatedBox>
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
