import * as React from 'react'
import {
    Image,
    SafeAreaView,
    useWindowDimensions,
    StyleSheet,
    Platform,
} from 'react-native'
import { Box, Button, Text } from '../../components'
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    interpolateColor,
    SharedValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { clamp } from 'react-native-redash'
import { Link } from 'expo-router'


const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedText = Animated.createAnimatedComponent(Text)

const OnboardingScreen = () => {
    const slides = [
        {
            title: 'Read News Online 📰',
            description:
                'Stay informed on the latest happenings around the world with our curated selection of top news stories.',
        },
        {
            title: 'News you love😎',
            description:
                'Never miss a story on the topics you love and care about with our personalized and interest-based news feed.',
        },
        {
            title: 'Save for later📌',
            description:
                "Don't have time to read an article now? Save it for later and catch up on your saved stories at your convenience.",
        },
    ]

    const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = useWindowDimensions()

    const translationX = useSharedValue(DEVICE_WIDTH)
    const SLIDE_TRESHHOLD = 0.15

    const handleOnboardingGesture = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { translationX: number }
    >({
        onStart: (_, ctx) => {
            ctx.translationX = translationX.value
        },

        onActive: (e, ctx) => {
            translationX.value = ctx.translationX + e.translationX
        },

        onEnd: (e) => {
            let nextSlideStartX = 0

            if (e.velocityX > 0) {
                nextSlideStartX = getSlideToPosition(
                    'prev',
                    translationX.value,
                    DEVICE_WIDTH,
                ) as number
            } else {
                nextSlideStartX = getSlideToPosition(
                    'next',
                    translationX.value,
                    DEVICE_WIDTH,
                ) as number
            }

            const shouldSlide =
                Math.abs(e.translationX) >= SLIDE_TRESHHOLD * DEVICE_WIDTH ||
                Math.abs(e.velocityX) >= 500

            if (shouldSlide) {
                translationX.value = withTiming(
                    clamp(
                        nextSlideStartX,
                        -DEVICE_WIDTH * (slides.length - 2),
                        DEVICE_WIDTH,
                    ),
                    { duration: 800, easing: Easing.out(Easing.cubic) },
                )
            } else {
                translationX.value = withTiming(
                    clamp(
                        getSlideToPosition(
                            'curr',
                            translationX.value,
                            DEVICE_WIDTH,
                        ) as number,
                        -DEVICE_WIDTH * (slides.length - 2),
                        DEVICE_WIDTH,
                    ),
                )
            }
        },
    })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translationX.value }],
    }))

    const { colors } = useTheme<Theme>()

    const opacity1 = useDerivedValue(() => {
        return interpolate(
            translationX.value,
            [DEVICE_WIDTH / 2, DEVICE_WIDTH],
            [0, 1],
            Extrapolation.CLAMP,
        )
    })

    const opacity2 = useDerivedValue(() => {
        return interpolate(
            translationX.value,
            [-DEVICE_WIDTH / 2, 0, DEVICE_WIDTH / 2],
            [0, 1, 0],
            Extrapolation.CLAMP,
        )
    })

    const opacity3 = useDerivedValue(() => {
        return interpolate(
            translationX.value,
            [-DEVICE_WIDTH / 2, -DEVICE_WIDTH],
            [0, 1],
            Extrapolation.CLAMP,
        )
    })

    const dot1Styles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            opacity1.value,
            [0, 1],
            [colors.mainText, colors.chocolate],
        ),
        opacity: interpolate(opacity1.value, [0, 1], [0.5, 1]),
        transform: [{ scale: interpolate(opacity1.value, [0, 1], [1, 1.5]) }],
    }))

    const dot2Styles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            opacity2.value,
            [0, 1],
            [colors.mainText, colors.chocolate],
        ),
        opacity: interpolate(opacity2.value, [0, 1], [0.5, 1]),
        transform: [{ scale: interpolate(opacity2.value, [0, 1], [1, 1.5]) }],
    }))

    const dot3Styles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            opacity3.value,
            [0, 1],
            [colors.mainText, colors.chocolate],
        ),
        opacity: interpolate(opacity3.value, [0, 1], [0.5, 1]),
        transform: [{ scale: interpolate(opacity3.value, [0, 1], [1, 1.5]) }],
    }))

    const dimension = useWindowDimensions()

    return (
        <SafeAreaView
            style={{ backgroundColor: colors.mainBackground, alignItems: 'center' }}
        >
            {/* @ts-ignore */}
            <PanGestureHandler onGestureEvent={handleOnboardingGesture}>

                <AnimatedBox
                    style={[animatedStyle, { flexDirection: 'row' }]}
                    width={DEVICE_WIDTH * slides.length}
                    height={DEVICE_HEIGHT}
                    position="relative"
                    backgroundColor={'mainBackground'}
                >
                    <Box width={DEVICE_WIDTH} style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/boyreading.png')}
                            style={{
                                objectFit: 'contain',
                                height: DEVICE_HEIGHT / 2,
                                width: DEVICE_WIDTH / 1.5,
                                transform: [
                                    { translateY: 40 },
                                ]
                            }}
                        />
                    </Box>
                    <Box width={DEVICE_WIDTH} style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/girlreading.png')}
                            style={{
                                objectFit: 'contain',
                                height: DEVICE_HEIGHT / 2.3,
                                width: DEVICE_WIDTH / 1.5,
                                transform: [
                                    { translateY: 50 }
                                ]
                            }}
                        />
                    </Box>
                    <Box width={DEVICE_WIDTH} style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/hands.png')}
                            style={{
                                objectFit: 'contain',
                                height: DEVICE_HEIGHT / 2.3,
                                width: DEVICE_WIDTH / 1.7,
                                transform: [
                                    { translateY: 40 },
                                ]
                            }}
                        />
                        <Image
                            source={require('../../assets/images/save.png')}
                            style={{
                                height: 70,
                                width: 70,
                                position: 'absolute',
                                top: '35%',
                                left: '70%',
                            }}
                        />
                    </Box>
                </AnimatedBox>
            </PanGestureHandler>

            <AnimatedOnboardingText
                text={slides[0].title}
                description={slides[0].description}
                animationValue={opacity1}
            />
            <AnimatedOnboardingText
                text={slides[1].title}
                description={slides[1].description}
                animationValue={opacity2}
            />
            <AnimatedOnboardingText
                text={slides[2].title}
                description={slides[2].description}
                animationValue={opacity3}
            />

            <Box
                style={styles.buttonAndIndicatorContainer}
                width={DEVICE_WIDTH * 0.9}
                px="lg"
                alignItems="center"
            >
                <Box style={styles.slideProgressIndicatorContainer}>
                    <AnimatedBox style={[styles.slideProgressDot, dot1Styles]} />
                    <AnimatedBox style={[styles.slideProgressDot, dot2Styles]} />
                    <AnimatedBox style={[styles.slideProgressDot, dot3Styles]} />
                </Box>

                <Box style={styles.buttonContainer}>
                    <Button
                        additionalStyles={{
                            width: DEVICE_WIDTH * 0.8,
                            marginTop: 10,
                            backgroundColor: colors.chocolate
                        }}
                        variant={'text'}
                    >
                        <Link href='auth/login' style={{ width: '100%' }}>
                            <Text fontFamily="Blatant" textAlign='center' fontSize={20} letterSpacing={3} style={{ color: 'white' }}>
                                GET STARTED
                            </Text>
                        </Link>
                    </Button>
                </Box>
            </Box>
        </SafeAreaView>
    )
}

interface AnimatedOnboardingTextProps {
    animationValue: SharedValue<number>
    text: string
    description: string
}

const AnimatedOnboardingText = ({
    text,
    description,
    animationValue,
}: AnimatedOnboardingTextProps) => {
    const opacityStyle = useAnimatedStyle(() => ({
        opacity: animationValue.value,
    }))

    return (
        <AnimatedBox
            backgroundColor={'mainBackground'}
            style={[styles.slideTextContainer, opacityStyle]}
            px="lg"
            alignItems="center"
            width="90%"
            pointerEvents={'none'}
        >
            <AnimatedText
                variant="heading1"
                letterSpacing={0.5}
                textAlign="center"
                marginBottom="sm"
            >
                {text}
            </AnimatedText>

            <AnimatedText
                fontFamily={'Gilroy'}
                textAlign="center"
                letterSpacing={0.2}
                opacity={0.8}
                lineHeight={34}
                fontSize={17}
            >
                {description}
            </AnimatedText>
        </AnimatedBox>
    )
}

const styles = StyleSheet.create({
    slideTextContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? '57%' : '53%',
    },
    slideProgressIndicatorContainer: {
        width: 70,
        // backgroundColor: 'red',
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    slideProgressDot: {
        width: 6,
        height: 6,
        borderRadius: 5,
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 32,
    },
    buttonAndIndicatorContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? '75%' : '73%',
    },
})

export default OnboardingScreen

function getSlideToPosition(
    type: 'next' | 'prev' | 'curr',
    translateX: number,
    deviceWidth: number,
    returnIndex?: boolean,
) {
    'worklet'
    const NUMBER_OF_SLIDES = 3

    const valuesArray = Array(NUMBER_OF_SLIDES)
        .fill(3)
        .map((_, index) => (index === 0 ? deviceWidth : (1 - index) * deviceWidth))

    if (translateX >= valuesArray[0]) {
        return returnIndex ? 0 : valuesArray[0]
    } else if (translateX <= valuesArray[valuesArray.length - 1]) {
        return returnIndex
            ? valuesArray.length - 1
            : valuesArray[valuesArray.length - 1]
    } else {
        for (let i = 0; i < valuesArray.length; i++) {
            if (translateX <= valuesArray[i] && translateX > valuesArray[i + 1]) {
                switch (type) {
                    case 'curr':
                        return returnIndex ? i : valuesArray[i]
                    case 'next':
                        return returnIndex ? i + 1 : valuesArray[i + 1]
                    case 'prev':
                        return returnIndex ? i : valuesArray[i]
                    default:
                        return returnIndex ? i : valuesArray[i]
                }
            }
        }
    }
}
