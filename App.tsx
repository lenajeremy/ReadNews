import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { StatusBar } from './components'
import { useColorScheme } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import theme, { darkTheme } from './theme'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import store from './redux/store'
import * as Linking from 'expo-linking'

SplashScreen.preventAutoHideAsync().catch((error) => console.error(error))

export default function App() {
  const isLoadingResourcesComplete = useCachedResources()

  const [appLoaded, setAppLoaded] = React.useState(false)
  const isDarkMode = useColorScheme() === 'dark'

  const url = Linking.useURL()

  if (url) {
    console.log(url)
    console.log(
      Linking.parse(
        'exp://172.20.10.2:19000/--/OpenNews?title=Daily+Crunch%3A+Cell+network+provider+Google+Fi+confirms+customer+data+breach&url=https%3A%2F%2Ftechcrunch.com%2F2023%2F01%2F31%2Fdaily-crunch-cell-network-provider-google-fi-confirms-customer-data-breach%2F&img=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2021%2F04%2FGettyImages-1249114648.jpg%3Fw%3D300%26h%3D160%26crop%3D1&website=TechCrunch&favicon=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2015%2F02%2Fcropped-cropped-favicon-gradient.png%3Fw%3D60',
      ),
    )
  }

  React.useEffect(() => {
    if (isLoadingResourcesComplete) {
      setAppLoaded(true)
      SplashScreen.hideAsync()
    }
  }, [isLoadingResourcesComplete])

  if (!appLoaded) {
    return null
  } else {
    return (
      <Provider {...{ store }}>
        <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    )
  }
}
