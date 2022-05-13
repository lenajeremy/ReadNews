import {
  Image,
  SafeAreaView,
  useWindowDimensions,
  StyleSheet,
} from 'react-native'
import { Box, Button, Text } from '../components'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnUI,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from '@shopify/restyle'
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

const OnboardingScreen = ({ navigation } : { navigation: any }) => {
  const slides = [
    {
      title: 'Read News Online 📰',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero velit blanditiis consectetur a soluta deserunt!',
    },
    {
      title: 'News you love😎',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero velit blanditiis consectetur a soluta deserunt!',
    },
    {
      title: 'Save for later📌',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero velit blanditiis consectetur a soluta deserunt!',
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

  // Animated.interpolateNode()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }))

  const { colors } = useTheme<Theme>()

  const opacity1 = useDerivedValue(() => {
    return interpolate(
      translationX.value,
      [DEVICE_WIDTH / 2, DEVICE_WIDTH],
      [0, 1],
      Extrapolate.CLAMP,
    )
  })

  const opacity2 = useDerivedValue(() => {
    return interpolate(
      translationX.value,
      [-DEVICE_WIDTH / 2, 0, DEVICE_WIDTH / 2],
      [0, 1, 0],
      Extrapolate.CLAMP,
    )
  })

  const opacity3 = useDerivedValue(() => {
    return interpolate(
      translationX.value,
      [-DEVICE_WIDTH / 2, -DEVICE_WIDTH],
      [0, 1],
      Extrapolate.CLAMP,
    )
  })

  // const indicatorProps = useAnimatedProps(() => {
    
  // })

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
          <AnimatedBox
            style={styles.slideProgressDot}
            backgroundColor="mainText"
          />
          <AnimatedBox
            style={styles.slideProgressDot}
            backgroundColor="mainText"
          />
          <AnimatedBox
            style={styles.slideProgressDot}
            backgroundColor="mainText"
          />
        </Box>

        <Box style={styles.buttonContainer}>
          <Button
          onPress={() => navigation.navigate('Login')}
            additionalStyles={{
              width: DEVICE_WIDTH * 0.8,
              height: 70,
              marginTop: 10,
            }}
          >
            <Text fontFamily="Blatant" fontSize={24} style ={{color: 'white'}}>
              GET STARTED
            </Text>
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
    >
      <AnimatedText
        variant="heading1"
        fontFamily="Blatant-Bold"
        letterSpacing={0.5}
        textAlign="center"
        marginBottom="sm"
      >
        {text}
      </AnimatedText>

      <AnimatedText textAlign="center" opacity={0.6} lineHeight={30}>
        {description}
      </AnimatedText>
    </AnimatedBox>
  )
}

const styles = StyleSheet.create({
  slideTextContainer: {
    position: 'absolute',
    top: '57%',
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
  },
  buttonAndIndicatorContainer: {
    position: 'absolute',
    bottom: '17%',
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
