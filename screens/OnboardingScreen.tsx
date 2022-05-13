import {
  Image,
  SafeAreaView,
  useWindowDimensions,
  StyleSheet,
} from 'react-native'
import { Box, Button, Text } from '../components'
import OnlineArticlesIllustration from '../assets/illustrations/onlinearticles'
import ShareArticlesIllustration from '../assets/illustrations/sharearticles'
import SaveArticlesIllustration from '../assets/illustrations/savearticles'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { backgroundColor, useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { useNavigation } from '@react-navigation/native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TextInput,
} from 'react-native-gesture-handler'
import { clamp } from 'react-native-redash'

const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const OnboardingScreen = () => {
  const slides = [
    {
      title: 'Online Articles',
      illustration: OnlineArticlesIllustration,
      description: 'Read articles from the internet',
    },
    {
      title: 'Share Articles',
      illustration: ShareArticlesIllustration,
      description: 'Share articles with your friends',
    },
    {
      title: 'Save Articles',
      illustration: SaveArticlesIllustration,
      description: 'Save articles to your library',
    },
  ]

  const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = useWindowDimensions()

  const translationX = useSharedValue(DEVICE_WIDTH)
  const SLIDE_TRESHHOLD = 0.2

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
          { duration: 500, easing: Easing.out(Easing.cubic) },
        )
      } else {
        translationX.value = withTiming(
          clamp(
            Math.floor(translationX.value / DEVICE_WIDTH) * DEVICE_WIDTH,
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

  const moveToNext = () => {
    'worklet'
    const value = getSlideToPosition(
      'next',
      translationX.value,
      DEVICE_WIDTH,
    ) as number
    console.log(value)
    translationX.value = withTiming(value)
  }

  const translateText = useDerivedValue(() => {
    return String(translationX.value)
  })

  const animatedProps = useAnimatedProps(() => {
    return {
      value: translateText.value,
    }
  })

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
              source={require('../assets/images/boyreading.png')}
              style={{ height: 500, width: 400, transform: [{ scale: 0.65 }] }}
            />
          </Box>
          <Box width={DEVICE_WIDTH} style={{ alignItems: 'center' }}>
            <Image
              source={require('../assets/images/girlreading.png')}
              style={{ height: 500, width: 320, transform: [{ scale: 0.65 }] }}
            />
          </Box>
          <Box width={DEVICE_WIDTH} style={{ alignItems: 'center' }}>
            <Image
              source={require('../assets/images/hands.png')}
              style={{
                height: 450,
                width: 300,
                transform: [{ scale: 0.7 }],
                position: 'relative',
                zIndex: 10,
              }}
            />
            <Image
              source={require('../assets/images/save.png')}
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

      <AnimatedBox
        style={styles.slideTextContainer}
        px="lg"
        alignItems="center"
        width="90%"
      >
        <AnimatedText
          variant="heading1"
          fontFamily="Blatant-Bold"
          letterSpacing={0.5}
          textAlign="center"
          marginBottom="sm"
          // style={opacityStyle}
        >
          Weirdly Original {translateText.value}
        </AnimatedText>

        <AnimatedTextInput
          value={translateText.value}
          animatedProps={animatedProps}
          editable = {false}
          style={{ fontSize: 30, color: 'white' }}
        />

        <Text textAlign="center" opacity={0.7} lineHeight={30}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis
          expedita possimus iste sed porro consectetur?
        </Text>

        <Box style={styles.slideProgressIndicatorContainer}>
          <Box style={styles.slideProgressDot} backgroundColor="mainText"></Box>
          <Box style={styles.slideProgressDot} backgroundColor="mainText"></Box>
          <Box style={styles.slideProgressDot} backgroundColor="mainText"></Box>
        </Box>

        <Box style={styles.prevAndNextButtonContainer}>
          <Button onPress={() => runOnUI(moveToNext)()}>
            <Text fontFamily="Blatant">Previous</Text>
          </Button>
          <Button>
            <Text fontFamily="Blatant">Next</Text>
          </Button>
        </Box>
      </AnimatedBox>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  slideTextContainer: {
    position: 'absolute',
    top: '58%',
  },
  slideProgressIndicatorContainer: {
    width: 70,
    // backgroundColor: 'red',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  slideProgressDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    opacity: 0.3,
  },
  prevAndNextButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
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
