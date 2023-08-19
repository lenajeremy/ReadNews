import * as React from 'react'
import { Box } from '../components';
import { useColorScheme } from 'react-native';
import useLocalStorage from '../hooks/useLocalStorage';
import { USER_SELECTED_THEME_KEY } from '../constants';

const ThemeContext = React.createContext<{
    theme: 'dark' | 'light',
}>({
    theme: 'dark',
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

    const deviceTheme = useColorScheme();
    const [userSelectedScheme, updateUserSelectedScheme] = useLocalStorage<'light' | 'dark'>(USER_SELECTED_THEME_KEY);

    updateUserSelectedScheme(theme)

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;