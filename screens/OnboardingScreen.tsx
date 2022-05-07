import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { Box, Text } from '../components'
import OnlineArticlesIllustration from '../assets/illustrations/onlinearticles'
import ShareArticlesIllustration from '../assets/illustrations/sharearticles'
import SaveArticlesIllustration from '../assets/illustrations/savearticles'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { useNavigation } from '@react-navigation/native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'

const AnimatedBox = Animated.createAnimatedComponent(Box)

const OnboardingScreen = () => {
  const NUMBER_OF_SLIDES = 3
  const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = useWindowDimensions()

  const translationX = useSharedValue(0)

  const handleOnboardingGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { translationX: number }
  >({
    onActive: (e, ctx) => {

      console.log(e.translationX)
      if (e.translationX >= 0)
        translationX.value = ctx.translationX + e.translationX
    },

    onEnd: (e) => {
      translationX.value = withTiming(0)

      console.log(e.translationX)
    },
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }))

  return (
    // @ts-ignore
    <PanGestureHandler onGestureEvent={handleOnboardingGesture}>
      <AnimatedBox
        style={[animatedStyle, { flexDirection: 'row' }]}
        width={DEVICE_WIDTH * NUMBER_OF_SLIDES}
        height={DEVICE_HEIGHT}
        position="relative"
      >
        <OnboardingSlide />
        <OnboardingSlide />
        <OnboardingSlide />
      </AnimatedBox>
    </PanGestureHandler>
  )
}

const OnboardingSlide = () => {
  const { width: DEVICE_WIDTH } = useWindowDimensions()

  return (
    <Box backgroundColor="chocolate" width={DEVICE_WIDTH}>
      <SafeAreaView>
        <Box backgroundColor="blue200" alignItems="center">
          <OnlineArticlesIllustration
            width={DEVICE_WIDTH * 0.75}
            height={350}
          />
        </Box>
      </SafeAreaView>
    </Box>
  )
}

export default OnboardingScreen
