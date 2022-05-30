import { StyleSheet } from 'react-native'
import Box from './Box'
import Text from './Text'

interface ToastProps {
  message: string
  type: 'warning' | 'error' | 'success' | 'info'
  title?: string
}

export default function Toast({ message, type, title }: ToastProps) {
  return (
    <Box>
      <Text variant="heading3">{title || (type.charAt(0).toUpperCase() + type.slice(1, type.length))}</Text>
      <Text variant="body">{message}</Text>
    </Box>
  )
}

const styles = StyleSheet.create({})
