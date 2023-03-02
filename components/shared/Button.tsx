import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'
import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { Theme } from '../../theme'
import Box from './Box'
import Text from './Text'
import PressableWithHaptics from './PressableWithHaptics'
import * as React from 'react'

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
  variant = 'contained',
}: ButtonProps) => {
  return (
    <PressableWithHaptics
      onPress={loading || variant === 'disabled' ? null : onPress}
    >
      <Box
        style={[styles.buttonContainer, additionalStyles]}
        backgroundColor={
          (loading || variant === 'disabled') ? 'grayBackground' : 'chocolate'
        }
      >
        {children}
      </Box>
    </PressableWithHaptics>
  )
}

type BackButtonProps = {
  pageName: string
  style?: ViewStyle
  textStyle?: TextStyle
}

export const BackButton = ({
  pageName,
  style = {},
  textStyle = {},
}: BackButtonProps) => {
  const { spacing, colors } = useTheme<Theme>()
  const navigation = useNavigation()

  return (
    <Button
      onPress={navigation.goBack}
      variant="contained"
      additionalStyles={{
        backgroundColor: colors.transparentBackground,
        borderRadius: 25,
        flexDirection: 'row',
        height: 48,
        paddingHorizontal: 18,
        minWidth: 110,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style,
      }}
    >
      <>
        {/* @ts-ignore */}
        <Ionicons
          name="return-up-back-outline"
          size={24}
          color={textStyle.color ?? colors.mainText}
        />
        <Text variant="body" style={textStyle} marginLeft="sm">
          {pageName}
        </Text>
      </>
    </Button>
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
