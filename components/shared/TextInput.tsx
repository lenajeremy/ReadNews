import { useEffect, useState } from 'react'
import {
  TextInput as RNTextInput,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Box from './Box'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { interpolateColor, useDerivedValue, withTiming } from 'react-native-reanimated'

type InputTypes = 'email' | 'password' | 'text'

interface TextInputProps {
  value: string
  onChangeText: (text: string, valid?: boolean) => void
  icon?: JSX.Element
  type: InputTypes
  additionalStyles?: ViewStyle
  placeholder: string
  validate?: (value: string) => boolean
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
  validate,
  additionalStyles,
  placeholder,
}: TextInputProps) => {
  const [secureText, setSecureText] = useState(true)
  const { colors } = useTheme<Theme>()

  // validation state is either of 0, 1 or NaN to represent invalid, valid and null respectively
  const [validationState, setValidationState] = useState<number>(NaN)

  const getValidateLineColor = () => {
    if (validationState === 0) return colors.error
    if (validationState === 1) return colors.success

    return colors.transparent
  }

  const _onChangeText = (text: string) => {
    const isValid = validate?.call(null, text)
    setValidationState(Number(isValid))

    onChangeText(text, isValid)
  }

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
        onChangeText={_onChangeText}
      />

      {type === 'password' ? (
        <Pressable
          style={{ height: '100%', justifyContent: 'center', padding: 16 }}
          onPress={() => setSecureText(!secureText)}
        >
          {/* @ts-ignore */}
          <Ionicons
            name={!secureText ? 'eye-off' : 'eye'}
            color={colors.mutedText}
            size={20}
          />
        </Pressable>
      ) : null}

      {/* Validator View */}
      <Box
        height={'100%'}
        width={3}
        position="absolute"
        right={0}
        style = {{backgroundColor: getValidateLineColor()}}
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
    // width: '100%',
    flex: 1,
  },
})

export default TextInput
