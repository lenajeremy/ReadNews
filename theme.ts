import { createTheme } from "@shopify/restyle";

const palette = {
    gray500: '#A7A7AF',
    gray200: '#EDF0F3',
    gray700: '#7C8383',
    gray800: '#646668',
    black: '#191B1F',
    chocolate: '#926C60',
    brown: '#514032',
    white: '#FFFFFF',
    whiteShade: '#F4F6FA',
    transparent: 'transparent',
}

const theme = createTheme({
    colors: {
        mainBackground: palette.whiteShade,
        bottomNavBarBackground: palette.white,
        mainText: palette.black,
        mutedText: palette.gray700,
        lightGrayBackground: palette.gray200,
        grayBackground: palette.gray800,
        chocolate: palette.chocolate,
        transparent: palette.transparent,
        transparentBackground: '#33333310',
    },
    spacing: {
        xxs: 3,
        xs: 6,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 36
    },
    textVariants: {
        heading1: {
            fontSize: 40,
        },
        heading2: {
            fontSize: 32,
        },
        heading3: {
            fontSize: 26,
            lineHeight: 36
        },
        body: {
            fontSize: 16,
            lineHeight: 24
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
    }
}

export default theme;

export type Theme = typeof theme;