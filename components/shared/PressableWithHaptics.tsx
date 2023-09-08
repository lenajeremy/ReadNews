import * as React from 'react'
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  Platform,
  Text,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

const PressableWithHaptics = ({
  children,
  onPress,
  onDoubleTap,
  ...otherPressableProps
}: PressableProps & { onDoubleTap?: () => void }) => {

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart((e) => {
    onDoubleTap && onDoubleTap()
    console.log('just double tapped')
  })

  const _onPress = React.useCallback(
    (e: GestureResponderEvent) => {
      Platform.OS === 'ios' && Haptics.selectionAsync()
      onPress && onPress(e)
    },
    [onPress],
  )

  return (
    <GestureDetector gesture={doubleTap}>
      <Pressable onPress={onDoubleTap ? () => {} : _onPress} {...otherPressableProps}>
        {children}
      </Pressable>
    </GestureDetector>
  )
}

export default PressableWithHaptics
