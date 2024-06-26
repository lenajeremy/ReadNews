import React from 'react'
import { BackButton, BottomSheetItem, Box, ErrorBoundary, PressableWithHaptics, Text } from '../../components'
import { router, useLocalSearchParams } from 'expo-router'
import { Dimensions, ImageBackground, SafeAreaView, Share, useColorScheme, StyleSheet, ActivityIndicator, Linking } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useBottomSheet } from '../../contexts/BottomSheetContext'
import { useGetNewsContentQuery, useRegisterInteractionMutation } from '../../api/newsApi'
import { NewsViewMode, OfflineNewsType } from '../../types'
import Constants from 'expo-constants'
import Reanimated, { Easing, withTiming } from 'react-native-reanimated'
import { Extrapolate, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import useLocalStorage from '../../hooks/useLocalStorage'
import { LIKED_NEWS_KEY, SAVED_NEWS_KEY } from '../../constants'
import { generateNewLinkToShare, getPageRouteName } from '../../utils'
import * as Haptics from 'expo-haptics'
import { BlurView } from 'expo-blur'
import WebView from 'react-native-webview'
import { RenderMdx } from 'rn-mdx'
import { Ionicons } from '@expo/vector-icons'

const AnimatedBox = Reanimated.createAnimatedComponent(Box)
const AnimatedText = Reanimated.createAnimatedComponent(Text)


export default function OpenNews(props: any) {

    const { url } = useLocalSearchParams() as { url: string }
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

    const { data, isFetching, isLoading, isError, error } = useGetNewsContentQuery(url || '')

    const [renderMdxError, setRenderMdxError] = React.useState<boolean>(false)
    const [viewMode, setViewMode] = React.useState<NewsViewMode>(NewsViewMode.WEBVIEW)

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

        if (!data) {
            return
        }

        const newLinkToShare = generateNewLinkToShare(
            data.title,
            data.url,
            data.img,
            data.metadata.website,
            data.metadata.favicon,
            props.segment
            // getPageRouteName(navigation),
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
                url: data.url,
                action: 'SHARE',
                effect: 'POSITIVE',
            })
        }
    }, [data])

    const like = React.useCallback(async () => {
        if (!data) {
            return
        }

        try {
            updateLikedNews([
                ...(likedNews || []),
                {
                    title: data.title,
                    url: data.url,
                    img: data.img,
                    metadata: data.metadata,
                    content: data.text,
                },
            ])

            const res = await registerInteraction({
                url: data.url,
                action: 'LIKE',
                effect: isLiked ? 'NEGATIVE' : 'POSITIVE',
            })

            if (res) {
                setLiked(!isLiked)
            }
        } catch (error) { }
    }, [isLiked, data])

    const save = React.useCallback(async () => {
        if (!data) return

        try {
            updateSavedNews([
                ...(savedNews || []),
                {
                    title: data.title,
                    url: data.url,
                    img: data.img,
                    metadata: data.metadata,
                    content: data.text,
                },
            ])
            const res = await registerInteraction({
                url: data.url,
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
                        source={{ uri: data?.img }}
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
                                    pageName={data?.metadata.website || ''}
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
                                {data?.title}
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
                            {data?.title}
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
                                source={{ uri: data?.url as string }}
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
                                                // @ts-ignore
                                                    style={[MdxComponentsStyles.link]}
                                                    onPress={() => Linking.openURL(href)}
                                                >
                                                    <Text
                                                        style={[
                                                            // @ts-ignore
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
                        onPress={router.canGoBack() ? router.back : () => {}}
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
                        // scrollViewMargin.value = STATUS_BAR_HEIGHT
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