import * as React from 'react'
import useLocalStorage from "./useLocalStorage";
import theme, { darkTheme } from '../theme'
import { useColorScheme } from 'react-native';

export type DeviceTheme = 'light' | 'dark' | 'system'

const useCurrentTheme = (): { theme: typeof theme, asString: DeviceTheme, setTheme: (theme: DeviceTheme) => void } => {
    const [localTheme, updateLocalTheme, loading] = useLocalStorage<DeviceTheme>('DEVICE_THEME')
    const colorSheme = useColorScheme()
    const [deviceTheme, setDeviceTheme] = React.useState<DeviceTheme>(localTheme || 'system')

    const updateDeviceTheme = (theme: DeviceTheme) => {
        updateLocalTheme(theme);
        setDeviceTheme(theme);
    }

    React.useEffect(() => {
        if (!loading) {
            setDeviceTheme(localTheme || 'system')
        }
    })

    const getTheme = () => {
        switch (deviceTheme) {
            case 'dark':
                return darkTheme
            case 'light':
                return theme
            default:
                return colorSheme === 'dark' ? darkTheme : theme
        }
    }

    console.log({ asString: deviceTheme, setTheme: updateDeviceTheme, localTheme, colorSheme })

    return { theme: getTheme(), asString: deviceTheme, setTheme: updateDeviceTheme }
}

export default useCurrentTheme;
