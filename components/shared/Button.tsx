import { Pressable, StyleSheet, ViewStyle } from 'react-native'
import Box from './Box'

interface ButtonProps {
    children: JSX.Element
    variant?: 'outline' | 'contained' | 'disabled',
    additionalStyles?: ViewStyle,
    onPress?: () => void
}

const Button = ( { children, additionalStyles, onPress } : ButtonProps ) => {
    return (
        <Pressable onPress={onPress}>
            <Box style = {[styles.buttonContainer, additionalStyles]}>
                { children }
            </Box>
        </Pressable>
    )
}

export default Button

const styles = StyleSheet.create({
    buttonContainer: {
        minWidth: 120,
        height: 50,
        backgroundColor: '# ',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})