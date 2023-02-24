import * as React from 'react'
import { Box, PressableWithHaptics, Text } from '../shared'
import { ActivityIndicator } from 'react-native'

const BottomSheetItem = ({
  icon,
  title,
  loading,
  disabled,
  onPress,
}: {
  icon: React.ReactNode
  title: string
  onPress?: VoidFunction
  loading?: boolean
  disabled?: boolean
}) => {
  return (
    <PressableWithHaptics
      disabled={disabled}
      onPress={disabled ? () => {} : onPress ? onPress : () => {}}
    >
      <Box
        flexDirection="row"
        paddingBottom="md"
        paddingVertical="xs"
        marginBottom="xxs"
        alignItems="center"
        justifyContent="space-between"
        opacity={disabled ? 0.5 : 1}
      >
        <Box flexDirection="row" alignItems="center">
          <Box
            backgroundColor="transparentBackground"
            padding="xs"
            borderRadius={200}
          >
            {icon}
          </Box>
          <Box width={12} />
          <Text fontSize={16} color={'mutedText'}>
            {title}
          </Text>
        </Box>
        {loading && <ActivityIndicator size="small" />}
      </Box>
    </PressableWithHaptics>
  )
}

export default BottomSheetItem
