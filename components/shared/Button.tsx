import { Pressable, StyleSheet, ViewStyle } from 'react-native'
import Box from './Box'


type ButtonVariants = 'outlined' | 'contained' | 'text' | 'disabled'


interface ButtonProps {
  children: JSX.Element
  additionalStyles?: ViewStyle
  onPress?: () => void
  loading?: boolean
  variant: ButtonVariants
}

const Button = ({
  children,
  additionalStyles,
  onPress,
  loading,
}: ButtonProps) => {
  return (
    <Pressable onPress={loading ? () => {} : onPress}>
      <Box
        style={[styles.buttonContainer, additionalStyles]}
        backgroundColor={loading ? 'grayBackground' : 'chocolate'}
      >
        {children}
      </Box>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  buttonContainer: {
    minWidth: 120,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
