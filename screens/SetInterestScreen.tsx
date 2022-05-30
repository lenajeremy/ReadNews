import { SafeAreaView, ScrollView } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { Text } from '../components'

const SetInterest = () => {
  const { colors, spacing } = useTheme<Theme>()
  return (
    <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
      <ScrollView
        style={{ marginHorizontal: spacing.md, paddingTop: spacing.xl * 4 }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="heading1">SetInterests</Text>
      </ScrollView>
    </SafeAreaView>
  )
}


export default SetInterest;