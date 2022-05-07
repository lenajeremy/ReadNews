import {
  ImageBackground,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { Box, Text } from '../components'
import OnlineArticlesIllustration from '../assets/illustrations/onlinearticles'
import ShareArticlesIllustration from '../assets/illustrations/sharearticles'
import SaveArticlesIllustration from '../assets/illustrations/savearticles'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { useNavigation } from '@react-navigation/native'

const AnimatedBox = Animated.createAnimatedComponent(Box)

const OnboardingScreen = () => {
  const { height } = useWindowDimensions()
  const y = useSharedValue(0)

  const animatedTransform = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }))

  const TRESH_HOLD = 0.4
  const NUMBER_OF_ELEMENTS = 0

  const handleGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { y: number }
  >({
    onStart: (_, ctx) => {
      ctx.y = y.value
    },
    onActive: (e, ctx) => {
      if (
        ctx.y + e.translationY <= 0 &&
        ctx.y + e.translationY >= -(NUMBER_OF_ELEMENTS - 1) * height
      ) {
        y.value = ctx.y + e.translationY
      }
    },
    onEnd: (e, ctx) => {
      const isUpward = Math.sign(e.translationY) === -1

      if (Math.abs(e.velocityY) > 1500) {
        y.value = withTiming(
          height * Math[isUpward ? 'floor' : 'ceil'](y.value / height),
        )
      } else {
        y.value = withTiming(
          height *
            Math[
              Math.abs(e.translationY) >= TRESH_HOLD * height ? 'floor' : 'ceil'
            ](y.value / height),
        )
      }

      console.log(y.value)
    },
  })

  return (
    //   @ts-ignore
    <PanGestureHandler onGestureEvent={handleGesture}>
      <AnimatedBox style={animatedTransform}>
        <InstaReelClone
          index={9}
          imageUrl="https://img.wallpapersafari.com/tablet/2048/2732/81/41/5RTbwu.jpg"
        />
      </AnimatedBox>
    </PanGestureHandler>
  )
}

const InstaReelClone = ({
  imageUrl,
  index,
}: {
  imageUrl: string
  index: number
}) => {

  const navigation = useNavigation()
  const { colors } = useTheme<Theme>()  
  const { width, height } = useWindowDimensions()

  return (
    <Box
      {...{ width, height }}
      justifyContent="flex-end"
      paddingBottom="lg"
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={{ flex: 1, ...StyleSheet.absoluteFillObject }}
      />

      <Box
        mx="md"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        // backgroundColor="primaryBlue"
      >
        <Box>
          <Text>hello</Text>
          <Pressable onPress = {() => navigation.navigate('Login')}>
            <Text>Go to home</Text>
          </Pressable>
        </Box>
        <Box>
          <Box mb="md" justifyContent="center" alignItems="center"> 
            <Ionicons name="heart-outline" color={colors.mainText} size={26} />
            <Text fontSize={14} textAlign="center">
              1.6M
            </Text>
          </Box>
          <Box mb="md" justifyContent="center" alignItems="center">
            <Ionicons name="chatbubble-outline" color={colors.mainText} size={26} />
            <Text fontSize={14} textAlign="center">
              1,839
            </Text>
          </Box>
          <Box mb="md" justifyContent="center" alignItems="center">
            <Ionicons name="md-share-social" color={colors.mainText} size={26} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OnboardingScreen
