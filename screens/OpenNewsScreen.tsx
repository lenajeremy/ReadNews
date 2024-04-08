import * as React from 'react'
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Share,
  SafeAreaView,
  Linking,
} from 'react-native'
import {
  Box,
  Text,
  BackButton,
  ErrorBoundary,
  PressableWithHaptics,
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
import { NewsViewMode, OfflineNewsType } from '../types'
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
import { generateNewLinkToShare, getPageRouteName } from '../utils'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import Constants from 'expo-constants'
import useLocalStorage from '../hooks/useLocalStorage'
import { SAVED_NEWS_KEY, LIKED_NEWS_KEY } from '../constants'
import { BottomSheet, useBottomSheet } from '../contexts/BottomSheetContext'

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

  const MdxComponentsStyles = React.useCallback(() => ({
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
  }), [])

  const isDarkMode = useColorScheme() === 'dark'

  const bottomSheet = useBottomSheet()

  const { data, isFetching, isLoading, isError } = useGetNewsContentQuery(
    route.params?.url || '',
  )

  const [renderMdxError, setRenderMdxError] = React.useState<boolean>(false)
  const [viewMode, setViewMode] = React.useState<NewsViewMode>(
    route.params.mode === 'offline' ? NewsViewMode.MDX : NewsViewMode.WEBVIEW,
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

  const [savedNews, updateSavedNews] = useLocalStorage<OfflineNewsType[]>(
    SAVED_NEWS_KEY,
    [],
  )

  const [likedNews, updateLikedNews] = useLocalStorage<OfflineNewsType[]>(
    LIKED_NEWS_KEY,
    [],
  )

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
      getPageRouteName(navigation),
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
    }
  }, [])

  const like = React.useCallback(async () => {
    try {
      updateLikedNews([
        ...(likedNews || []),
        {
          title: data?.title || route.params.title,
          url: data?.url || route.params.url,
          img: data?.img || route.params.img,
          metadata: data?.metadata || {
            website: route.params.website,
            favicon: route.params.favicon,
            time_added: '',
          },
          content: data?.text || '',
        },
      ])

      const res = await registerInteraction({
        url: route.params.url,
        action: 'LIKE',
        effect: isLiked ? 'NEGATIVE' : 'POSITIVE',
      })

      if (res) {
        setLiked(!isLiked)
      }
    } catch (error) { }
  }, [isLiked])

  const save = React.useCallback(async () => {
    try {
      updateSavedNews([
        ...(savedNews || []),
        {
          title: data?.title || route.params.title,
          url: data?.url || route.params.url,
          img: data?.img || route.params.img,
          metadata: data?.metadata || {
            website: route.params.website,
            favicon: route.params.favicon,
            time_added: '',
          },
          content: data?.text || '',
        },
      ])
      const res = await registerInteraction({
        url: route.params.url,
        action: 'SAVE',
        effect: isLiked ? 'NEGATIVE' : 'POSITIVE',
      })

      if (res) {
        setSaved(!isSaved)
      }
    } catch (error) { }
  }, [isSaved, savedNews, data])


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
          {isLoading && route.params.mode === 'online' && (
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
              renderToHardwareTextureAndroid={true}
            >
              <WebView
                incognito={true}
                onLoadProgress={(e) => {
                  loadProgress.value = withTiming(e.nativeEvent.progress, {
                    duration: 800,
                    easing: Easing.cubic,
                  })
                }}
                // cacheEnabled={false}
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
                  // @ts-ignore
                  componentStyle={MdxComponentsStyles}
                  components={{
                    // @ts-ignore
                    a: ({
                      href,
                      children,
                    }: {
                      href: string
                      children: React.ReactNode
                    }) => {
                      return (
                        <Text
                          style={[MdxComponentsStyles.link]}
                          onPress={() => Linking.openURL(href)}
                        >
                          <Text
                            style={[
                              MdxComponentsStyles.text,
                              // @ts-ignore
                              MdxComponentsStyles.linkLabel,
                            ]}
                          >
                            {children}
                          </Text>
                        </Text>
                      )
                    },
                    // @ts-ignore
                    h1: () => ''
                  }}
                >{`

                  # Roblox faces a new class action lawsuit alleging it facilitates child gambling

                  *Published on August 18, 2023 by Taylor Hatmaker*

                  In a new class action lawsuit filed in the Northern District of California this week, two parents accuse Roblox of illegally facilitating child gambling.

                  While gambling is not allowed on the platform, which hosts millions of virtual games that cater to children and teens, the lawsuit points to third-party gambling sites that invite users to play blackjack, slots, roulette, and other games of chance using Roblox’s in-game currency.

                  The lawsuit, first reported by Bloomberg Law, was filed on behalf of plaintiffs Rachel Colvin and Danielle Sass, two mothers with children who have gambled on third-party sites that tie into Roblox’s virtual currency, Robux. Both parents claim that their children, named as minor plaintiffs in the suit, have lost thousands of Robux gambling on those sites without their knowledge (Robux currently sells 800 Robux on its website for $9.99 with deeper discounts for larger amounts of the digital currency).

                  The lawsuit specifically names RBXFlip, Bloxflip, and RBLXWild as participants in “an illegal gambling operation that is preying on children nationwide.” The owners of those sites are named as defendants along with Roblox itself. RBXFlip, which entices players with “fun and fair games,” has been on the radar of the Roblox community since at least 2019 and continues to operate today.

                  Roblox itself is a vast collection of virtual experiences and not a game in a traditional sense. Those experiences, crafted by amateur and professional developers alike, can lightly depict gambling by showing casinos or non-player card dealers, for example, but “experiences that include simulated gambling, including playing with virtual chips, simulated betting, or exchanging real money, Robux, or in-experience items of value are not allowed.”

                  The plaintiffs call those rules misleading, given Roblox’s apparent tolerance for third-party betting sites. “In its Terms of Service, Roblox misleadingly represents to parents and other users that its platform and digital currency are safe,” the lawsuit states. “… This representation is false, or misleading at best.”

                  The lawsuit alleges that Roblox maintains control over the flow of Robux and therefore has full knowledge of shady, third-party gambling sites that entice kids to play with the in-game currency.

                  “Roblox could, of course, prohibit and/or stop the Gambling Website Defendants from utilizing the Roblox ecosystem and digital currency to facilitate illegal gambling but it does not,” the lawsuit states, accusing the company of profiting from the scheme in the millions by drawing a 30 percent fee on transactions, those included.

                  In an email to TechCrunch, Roblox declined to answer specific questions, but emphasized that the gambling sites are in no way affiliated with Roblox.

                  “Bad actors make illegal use of Roblox’s intellectual property and branding to operate such sites in violation of our standards,” the company wrote in a statement.

                  “… Ensuring a safe and compliant online experience for users of Roblox is a core tenant of the company. Roblox will continue to be vigilant in combating entities who engage in practices that are in violation of our policies or endanger the safety of our community.”

                  Roblox also pointed out that it has dedicated teams that investigate websites like those named in the lawsuit and in some instances may pursue having those sites removed. But given the company’s wording here, it’s not clear that Roblox views these established third-party gambling sites as violating its terms of service by using Robux for underage gambling off-platform. Roblox has certainly had plenty of time to pursue legal action against these sites or otherwise close up the loopholes that make them possible.

                  While Roblox disallows in-game gambling, it does encourage a few other notorious forms of virtual commerce. Many Roblox experiences entice young players with lootboxes — randomized virtual goods paid with real money via in-game currency. Lootboxes are still legal in the U.S. but they have been outlawed in countries like the Netherlands. The practice may be due for an EU-wide crackdown that will have broad ripple effects for game developers who choose to juice revenues with the lucrative, predatory practice.

                  Roblox also added support for limited edition virtual items in recent years, allowing developers to offer special virtual goods sold in numbered quantities. Limiteds offer developers another source of revenue, but their NFT-like appeal — and Roblox’s decision to foster a full Robux-based trading economy — does raise eyebrows given that the platform centers children and teens, at least for now.

                  [Link to the original article](https://techcrunch.com/2023/08/18/roblox-children-gambling-class-action-lawsuit-robux/)
                  `}
                  {/* {data?.text} */}
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
            onPress={() => bottomSheet.openSheet(<BottomSheetContent {...{ isLiked, like, viewMode, isSaved, share, setViewMode, renderMdxError, data }} />)}
          >
            <Ionicons
              name="ellipsis-horizontal-circle"
              size={24}
              color={colors.mainText}
            />
          </PressableWithHaptics>
        </AnimatedBox>
      </SafeAreaView>
    </Box>
  )
}

const BottomSheetContent = ({ isLiked, like, viewMode, isSaved, share, setViewMode, renderMdxError, data }: {
  isLiked: boolean, like: () => void,
  viewMode: NewsViewMode, isSaved: boolean,
  share: () => void, setViewMode: React.Dispatch<React.SetStateAction<NewsViewMode>>,
  renderMdxError: boolean, data: any
}) => {
  const { colors } = useTheme<Theme>()
  return (
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
        title={`${viewMode === NewsViewMode.MDX ? 'Close' : 'Open'
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
    </Box>)
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: Dimensions.get('window').width,
  },
})

export default OpenNewsScreen
