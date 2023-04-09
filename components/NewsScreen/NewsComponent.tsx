import * as React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Image, useWindowDimensions, View } from 'react-native'
import { Box, PressableWithHaptics, Text } from '../shared/index'
import { NewsType } from '../../types'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

// @ts-ignore
// import Image from 'expo-cached-image'

const AnimatedBox = Reanimated.createAnimatedComponent(Box)

const NewsComponent = ({
  item,
  registerInteraction,
  removeItem,
}: {
  item: NewsType
  registerInteraction: (newurl: string) => void
  removeItem: (newsurl: string) => void
}) => {
  const { width: DEVICE_WIDTH } = useWindowDimensions()
  const gesture = Gesture.Pan()

  const containerRef = React.useRef<React.ComponentRef<typeof View>>(null)
  const [containerHeight, setContainerHeight] = React.useState<number>(0)

  containerRef.current?.measureInWindow((x, y, width, height) => {
    setContainerHeight(height)
  })

  const heightValue = useSharedValue(containerHeight)
  const heightStyle = useAnimatedStyle(() => {
    return { height: heightValue.value }
  })

  gesture.minDistance(40)

  gesture
    .onBegin((e) => {
      gesture.config = { position: 0 }
    })
    .onUpdate((e) => {
      if (Math.abs(e.translationX) > 85 && Math.abs(e.translationX) < 88)
        Haptics.notificationAsync()
      translationValue.value =
        (gesture.config.position as number) + e.translationX
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 85) {
        translationValue.value = withTiming(
          Math.sign(e.translationX) * DEVICE_WIDTH,
          { duration: 400 },
          () => {
            runOnJS(removeItem)(item.url)
          },
        )
      } else {
        translationValue.value = withTiming(0, { duration: 400 })
      }
    })

  const translationValue = useSharedValue<number>(0)

  const translationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationValue.value }],
  }))

  const dateString = React.useMemo(() => {
    const date = new Date(item.metadata.time_added)

    return date.toDateString()
  }, [item.metadata.time_added])

  const navigation = useNavigation()

  return (
    <GestureDetector gesture={gesture}>
      <PressableWithHaptics
        onPress={() => {
          registerInteraction(item.url)
          navigation.navigate('OpenNews', {
            url: item.url,
            img: item.img,
            favicon: item.metadata.favicon,
            website: item.metadata.website,
            title: item.title,
          })
        }}
      >
        <AnimatedBox position="relative" ref={containerRef}>
          <AnimatedBox
            zIndex={2}
            flexDirection="row"
            paddingVertical={'lg'}
            alignItems="center"
            paddingHorizontal="lg"
            backgroundColor={'mainBackground'}
            style={[translationStyle]}
          >
            <Box flex={2.5} marginRight="lg">
              <Text
                color="mainText"
                fontSize={18}
                lineHeight={26}
                fontFamily="Gilroy-Bold"
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>

              <Box flexDirection="row" paddingVertical="sm" alignItems="center">
                <Image
                  source={{ uri: item.metadata.favicon }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    marginRight: 10,
                  }}
                />
                <Text color="mutedText" fontSize={13}>
                  {item.metadata.website}
                </Text>

                <Box
                  backgroundColor="mutedText"
                  width={5}
                  opacity={0.6}
                  height={5}
                  borderRadius={3}
                  marginHorizontal={'sm'}
                />
                <Text color="mutedText" fontSize={13}>
                  {dateString}
                </Text>
              </Box>
            </Box>
            <Box width={100} height={100} borderRadius={12} overflow="hidden">
              <Image
                source={{ uri: item.img }}
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'lightgray',
                }}
                resizeMode="cover"
              />
            </Box>
          </AnimatedBox>
          <Box
            style={{ backgroundColor: 'tomato', paddingHorizontal: 40 }}
            alignItems="center"
            justifyContent="space-between"
            position="absolute"
            flexDirection="row"
            width="100%"
            height="100%"
            zIndex={1}
          >
            <AntDesign name={'dislike1'} color="white" size={20} />
            <AntDesign name={'dislike1'} color="white" size={20} />
          </Box>
        </AnimatedBox>
      </PressableWithHaptics>
    </GestureDetector>
  )
}

export default React.memo(NewsComponent)
