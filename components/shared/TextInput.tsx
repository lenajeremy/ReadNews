import { useState } from 'react'
import { TextInput as RNTextInput, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Box from './Box'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'

type InputTypes = 'email' | 'password' | 'text'

interface TextInputProps {
  value: string
  onChangeText: (text: string) => void
  icon?: JSX.Element
  type: InputTypes
  additionalStyles?: ViewStyle
  placeholder: string
}

const getKeyboardType = (type: InputTypes) => {
  if (type === 'email') return 'email-address'
  if (type === 'password') return 'visible-password'
  if (type === 'text') return 'default'

  return 'default'
}

const getIconString = (type: InputTypes) => {
  if (type === 'email') return 'mail'
  if (type === 'password') return 'key'

  return 'person'
}

const TextInput = ({
  value,
  onChangeText,
  icon,
  type,
  additionalStyles,
  placeholder,
}: TextInputProps) => {
  const [secureText, setSecureText] = useState(true)
  const { colors } = useTheme<Theme>()

  return (
    <Box
      style={[styles.inputContainer, additionalStyles]}
      backgroundColor="transparentBackground"
    >
      <Box style={styles.iconContainer}>
        {/* @ts-ignore */}
        <Ionicons
          name={getIconString(type)}
          size={20}
          color={colors.mutedText}
        />
      </Box>
      <RNTextInput
      placeholder={placeholder}

        style={[styles.input, { color: colors.mainText }]}
        value={value}
        secureTextEntry={type === 'password' && secureText}
        keyboardType={getKeyboardType(type)}
        onChangeText={onChangeText}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 65,
    width: '100%',
    color: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    padding: 16,
  },
  input: {
    fontSize: 18,
    fontFamily: 'Blatant',
    height: '100%',
    width: '100%',
  },
})

export default TextInput
