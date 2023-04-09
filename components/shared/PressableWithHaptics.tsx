import * as React from 'react'
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  Platform,
} from 'react-native'
import * as Haptics from 'expo-haptics'

const PressableWithHaptics = ({
  children,
  onPress,
  ...otherPressableProps
}: PressableProps) => {
  const _onPress = React.useCallback(
    (e: GestureResponderEvent) => {
      Platform.OS === 'ios' && Haptics.selectionAsync()
      onPress && onPress(e)
    },
    [onPress],
  )

  return (
    <Pressable onPress={_onPress} {...otherPressableProps}>
      {children}
    </Pressable>
  )
}

export default PressableWithHaptics
