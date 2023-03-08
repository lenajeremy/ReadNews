import React, { useEffect, useState } from 'react'
import {
  TextInput as RNTextInput,
  StyleSheet,
  ViewStyle,
  Pressable,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Box from './Box'
import Text from './Text'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useDebounce } from '../../utils'

type InputTypes = 'email' | 'password' | 'text'

interface TextInputProps {
  value: string
  onChangeText: (text: string, valid?: boolean) => void
  icon?: JSX.Element
  type: InputTypes
  additionalStyles?: ViewStyle
  placeholder: string
  validate?: (value: string) => boolean
  onValidate?: (value: boolean) => void
  suffix?: React.ReactNode
}

const getKeyboardType = (type: InputTypes) => {
  if (type === 'email') return 'email-address'
  if (type === 'password') return Platform.OS === 'ios' ? 'default' : 'password'
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
  onValidate,
  additionalStyles,
  placeholder,
  suffix,
}: TextInputProps) => {
  const [secureText, setSecureText] = useState(true)
  const { colors } = useTheme<Theme>()

  const [debouncedValidate, isValidated] = useDebounce(
    validate || ((val: string) => false),
    500,
    false,
  )
  const [firstRender, setFirstRender] = React.useState<boolean>(true)

  // validation state is either of 0, 1 or NaN to represent invalid, valid and null respectively
  const [validationState, setValidationState] = useState<number>(NaN)

  const getValidateLineColor = () => {
    if (validationState === 0) return colors.error
    if (validationState === 1) return colors.success

    return colors.transparent
  }

  React.useEffect(() => {
    if (validate) {
      if (firstRender) {
        setValidationState(NaN)
      } else {
        setValidationState(Number(isValidated))
      }
    }

    setFirstRender(false)
  }, [isValidated])

  React.useEffect(() => {
    onValidate && onValidate(Boolean(validationState));
  }, [validationState])

  const _onChangeText = (text: string) => {
    debouncedValidate(text)
    onChangeText(text, isValidated)
  }

  return (
    <Box
      style={[styles.inputContainer, additionalStyles]}
      backgroundColor="transparentBackground"
    >
      <Box style={styles.iconContainer}>
        {/* @ts-ignore */}
        {icon ? (
          icon
        ) : (
          <Ionicons
            name={getIconString(type)}
            size={20}
            color={colors.mutedText}
          />
        )}
      </Box>
      <RNTextInput
        placeholder={placeholder}
        style={[styles.input, { color: colors.mainText }]}
        value={value}
        secureTextEntry={type === 'password' && secureText}
        // @ts-ignore
        keyboardType={getKeyboardType(type)}
        placeholderTextColor={colors.mediumGrayBackground}
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

      {suffix ? suffix : null}

      {/* Validator View */}
      <Box
        height={'100%'}
        width={3}
        position="absolute"
        right={0}
        style={{ backgroundColor: getValidateLineColor() }}
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
