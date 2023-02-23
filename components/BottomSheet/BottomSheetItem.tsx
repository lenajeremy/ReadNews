import * as React from 'react'
import { Box, PressableWithHaptics, Text } from '../shared'
import { Theme } from '../../theme'
import { useTheme } from '@shopify/restyle'
import { EvilIcons } from '@expo/vector-icons'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { ActivityIndicator } from 'react-native'

const BottomSheetItem = ({
  icon,
  title,
  loading,
}: {
  icon: React.ReactNode
  title: string
  onPress?: VoidFunction
  loading?: boolean
}) => {
  return (
    <TouchableOpacity>
      <Box
        flexDirection="row"
        paddingBottom="md"
        paddingVertical="sm"
        marginBottom="xxs"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flexDirection="row" alignItems="center">
          <Box
            backgroundColor="transparentBackground"
            padding="sm"
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
    </TouchableOpacity>
  )
}

export default BottomSheetItem
