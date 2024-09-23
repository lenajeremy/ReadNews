import { createTheme } from "@shopify/restyle";

const palette = {
    gray500: '#A7A7AF',
    gray200: '#EDF0F3',
    gray700: '#7C8383',
    gray800: '#646668',
    black: '#0e0e11',
    chocolate: '#fc7713',
    brown: '#514032',
    white: '#F5F5F5',
    whiteShade: '#F4F6FA',
    transparent: 'transparent',

    blue700: '#2B7EFE',
    blue400: '#908AFA',
    blue200: '#DCE7F7',
}

const theme = createTheme({
    colors: {
        mainBackground: palette.whiteShade,
        bottomTabBarBackground: '#FFFFFF',
        mainText: palette.black,
        mutedText: '#4d4d4d',
        lightGrayBackground: palette.gray200,
        mediumGrayBackground: palette.gray500,
        grayBackground: palette.gray800,
        chocolate: palette.chocolate,
        transparent: palette.transparent,
        transparentBackground: '#33333315',
        light: palette.white,
        bottomSheetBackground: palette.whiteShade,

        blue200: palette.blue200,
        blue400: palette.blue400,
        primaryBlue: palette.blue700,
        error: '#DF1414',
        success: '#26B97A',
    },
    spacing: {
        none: 0,
        xxs: 2,
        xs: 6,
        sm: 8,
        md: 20,
        lg: 24,
        xl: 32
    },
    textVariants: {
        heading1: {
            fontSize: 30,
            fontFamily: 'Blatant-Bold'
        },
        heading2: {
            fontSize: 26,
            fontFamily: 'Blatant',
            lineHeight: 32
        },
        heading3: {
            fontSize: 24,
            lineHeight: 36
        },
        body: {
            fontSize: 16,
            lineHeight: 24,
            fontFamily: 'Gilroy'
        }
    },
    breakpoints: {}
});

export const darkTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        mainBackground: palette.black,
        mainText: palette.gray200,
        transparentBackground: '#ffffff10',
        bottomSheetBackground: '#242526',
        mutedText: palette.gray700,
        bottomTabBarBackground: '#222222'
    }
}

export default theme;

export type Theme = typeof theme;