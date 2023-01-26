import * as React from 'react';
import { useTheme } from '@shopify/restyle'
import { SafeAreaView, useColorScheme } from 'react-native'
import { Header, News, Text } from '../components'
import { useAppSelector } from '../hooks/reduxhooks'
import { RootTabScreenProps } from '../navigation/types'
import { Theme } from '../theme'

export const NewsScreen = ({
  navigation,
}: RootTabScreenProps<'NewsScreen'>) => {
  const { colors } = useTheme<Theme>()
  const user = useAppSelector((store) => store.user)

  return (
    <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
      <Text>{JSON.stringify(user, null, 3)}</Text>
      <Header />
      <News />
    </SafeAreaView>
  )
}

export default NewsScreen
