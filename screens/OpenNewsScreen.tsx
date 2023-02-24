import * as React from 'react'
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Share,
  SafeAreaView,
} from 'react-native'
import {
  Box,
  Text,
  BackButton,
  ErrorBoundary,
  PressableWithHaptics,
  Button,
  BottomSheetItem,
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
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Reanimated from 'react-native-reanimated'
import { useColorScheme } from 'react-native'
import { generateNewLinkToShare } from '../utils'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import Constants from 'expo-constants'

const AnimatedBox = Reanimated.createAnimatedComponent(Box)
const AnimatedText = Reanimated.createAnimatedComponent(Text)

const OpenNewsScreen = ({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, 'OpenNews'>) => {
  const { colors, spacing } = useTheme<Theme>()
  const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get(
    'window',
  )

  const bottomSheetRef = React.useRef<BottomSheet>(null)

  const isDarkMode = useColorScheme() === 'dark'

  const { data, isFetching, isLoading, isError } = useGetNewsContentQuery(
    route.params?.url || '',
  )

  const [renderMdxError, setRenderMdxError] = React.useState<boolean>(false)
  const [viewMode, setViewMode] = React.useState<NewsViewMode>(
    NewsViewMode.WEBVIEW,
  )

  const TOP_SCREEN_HEIGHT =
    viewMode === NewsViewMode.MDX ? Dimensions.get('window').height * 0.2 : 0

  const STATUS_BAR_HEIGHT = Constants.statusBarHeight

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
          [0, STATUS_BAR_HEIGHT + 60],
          [TOP_SCREEN_HEIGHT, STATUS_BAR_HEIGHT + 40],
          Extrapolate.CLAMP,
        ),
  )

  const scrollViewMargin = useDerivedValue(() =>
    interpolate(
      scrollPosition.value,
      [0, STATUS_BAR_HEIGHT + 60],
      [TOP_SCREEN_HEIGHT, STATUS_BAR_HEIGHT + 40],
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
    let interpolated = interpolate(
      heightValue.value,
      [STATUS_BAR_HEIGHT + 40, STATUS_BAR_HEIGHT + 60],
      [-4, STATUS_BAR_HEIGHT / 2],
      Extrapolate.CLAMP,
    )

    console.log(interpolated)
    return {
      opacity:
        heightValue.value > TOP_SCREEN_HEIGHT
          ? 0
          : interpolate(
              heightValue.value,
              [STATUS_BAR_HEIGHT + 40, STATUS_BAR_HEIGHT + 50],
              [1, 0],
              Extrapolate.CLAMP,
            ),
      translateY: interpolated,
    }
  })

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: animatedTitleValues.value.opacity,
    transform: [{ translateY: animatedTitleValues.value.translateY }],
    zIndex: 1000,
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

  const snapPoints = React.useMemo(() => ['50%'], [])

  const renderBottomSheetBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={false}
        opacity={0.7}
      />
    ),
    [],
  )

  const loadProgress = useSharedValue<number>(0)

  const loadIndicatorStyle = useAnimatedStyle(() => ({
    height: loadProgress.value === 1 ? 0 : 2.5,
    width: loadProgress.value * DEVICE_WIDTH,
    backgroundColor:
      loadProgress.value === 1 ? colors.transparent : colors.primaryBlue,
  }))

  return (
    <Box flex={1} backgroundColor="mainBackground">
      {viewMode === NewsViewMode.MDX && (
        <AnimatedBox style={heightStyle} position="absolute" width={'100%'}>
          <ImageBackground
            source={{ uri: route.params?.img }}
            style={StyleSheet.absoluteFillObject}
          />
          <Box
            flexDirection="row"
            paddingHorizontal="lg"
            style={{ marginTop: STATUS_BAR_HEIGHT + 8 }}
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
      )}

      <Reanimated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          scrollPosition.value = e.nativeEvent.contentOffset.y
        }}
        scrollEventThrottle={16}
        style={scrollViewAnimatedStyle}
      >
        <Box
          flex={1}
          backgroundColor="mainBackground"
          paddingHorizontal={viewMode === NewsViewMode.MDX ? 'lg' : 'none'}
          paddingVertical={viewMode === NewsViewMode.WEBVIEW ? 'none' : 'lg'}
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
          {isLoading && (
            <Box
              flex={1}
              height={DEVICE_HEIGHT}
              alignItems="center"
              justifyContent="center"
            >
              <ActivityIndicator />
            </Box>
          )}

          <Box backgroundColor="mainBackground">
            <SafeAreaView
              style={{
                opacity: viewMode === NewsViewMode.WEBVIEW ? 1 : 0,
                height: viewMode === NewsViewMode.WEBVIEW ? 'auto' : 0,
              }}
            >
              <WebView
                incognito={true}
                onLoadProgress={(e) => {
                  loadProgress.value = withTiming(e.nativeEvent.progress, {
                    duration: 800,
                    easing: Easing.cubic,
                  })
                }}
                cacheEnabled={false}
                style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
                source={{ uri: route.params?.url as string }}
              />
            </SafeAreaView>

            <ErrorBoundary
              onError={() => {
                setRenderMdxError(true)
                setViewMode(NewsViewMode.WEBVIEW)
              }}
            >
              <Box
                opacity={viewMode === NewsViewMode.MDX ? 1 : 0}
                flex={1}
                height={viewMode === NewsViewMode.MDX ? 'auto' : 0}
              >
                <RenderMdx
                  componentStyle={{
                    root: {
                      backgroundColor: colors.mainBackground,
                    },
                    img: {
                      width: DEVICE_WIDTH - spacing.lg * 2,
                      height: 250,
                      backgroundColor: 'lightgray',
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
                    },
                    link: { marginTop: -3 },
                    linkLabel: {
                      fontSize: 17,
                      lineHeight: 32,
                      textDecorationColor: colors.mainText,
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                      // color: colors.,
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
              </Box>
            </ErrorBoundary>
          </Box>
        </Box>
      </Reanimated.ScrollView>
      <AnimatedBox style={loadIndicatorStyle} />
      <SafeAreaView>
        <AnimatedBox
          backgroundColor={'mainBackground'}
          alignItems={'center'}
          justifyContent="space-around"
          flexDirection="row"
          borderTopColor={'transparentBackground'}
          borderTopWidth={1.5}
        >
          <PressableWithHaptics
            onPress={navigation.goBack}
            style={{ padding: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.mainText} />
          </PressableWithHaptics>
          <PressableWithHaptics style={{ padding: 16 }} onPress={like}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? colors.error : colors.mainText}
            />
          </PressableWithHaptics>
          <PressableWithHaptics style={{ padding: 16 }} onPress={save}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? colors.primaryBlue : colors.mainText}
            />
          </PressableWithHaptics>
          <PressableWithHaptics
            style={{ padding: 16 }}
            onPress={() => {
              bottomSheetRef.current?.expand()
            }}
          >
            <Ionicons
              name="ellipsis-horizontal-circle"
              size={24}
              color={colors.mainText}
            />
          </PressableWithHaptics>
        </AnimatedBox>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        index={-1}
        backgroundStyle={{ backgroundColor: colors.bottomSheetBackground }}
        backdropComponent={renderBottomSheetBackdrop}
        handleIndicatorStyle={{
          backgroundColor: colors.mutedText,
          height: 6,
          width: 40,
        }}
      >
        <Box padding="md" paddingHorizontal="lg">
          <BottomSheetItem
            icon={
              <Ionicons
                name="heart"
                color={isLiked ? colors.error : colors.mainText}
                size={24}
              />
            }
            title={'I like this news'}
            onPress={like}
          />
          <BottomSheetItem
            icon={
              <Ionicons
                name="heart-dislike"
                color={colors.mainText}
                size={24}
              />
            }
            title={"I don't like this news"}
          />
          <BottomSheetItem
            disabled={renderMdxError || data?.text === ''}
            icon={<Ionicons name="reader" color={colors.mainText} size={24} />}
            title={`${
              viewMode === NewsViewMode.MDX ? 'Close' : 'Open'
            } Reader Mode`}
            onPress={() => {
              setViewMode(
                viewMode === NewsViewMode.MDX
                  ? NewsViewMode.WEBVIEW
                  : NewsViewMode.MDX,
              )

              if (viewMode === NewsViewMode.MDX) {
                // @ts-ignore
                scrollViewMargin.value = STATUS_BAR_HEIGHT
              }
            }}
          />
          <BottomSheetItem
            icon={
              <Ionicons
                name="bookmark"
                color={isSaved ? colors.primaryBlue : colors.mainText}
                size={24}
              />
            }
            title={isSaved ? 'Remove from save for later' : 'Save for later'}
            loading
          />
          <BottomSheetItem
            icon={
              <Ionicons name="share-social" color={colors.mainText} size={24} />
            }
            title={'Share with your friends'}
            onPress={share}
          />
        </Box>
      </BottomSheet>
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
