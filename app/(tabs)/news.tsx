import * as React from 'react'
import { useTheme } from '@shopify/restyle'
import { SafeAreaView } from 'react-native'
import { Header, News } from '../../components'
import { RootTabScreenProps } from '../../navigation/types'
import { Theme } from '../../theme'

export const NewsScreen = ({
    navigation,
}: RootTabScreenProps<'NewsScreen'>) => {
    const { colors } = useTheme<Theme>()

    return (
        <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
            <Header />
            <News />
        </SafeAreaView>
    )
}

export default NewsScreen
