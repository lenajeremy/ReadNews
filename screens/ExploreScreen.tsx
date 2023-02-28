import * as React from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native'
import { Box, NewsComponent, Text, TextInput } from '../components'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { Ionicons } from '@expo/vector-icons'
import { debounce } from '../utils'
import {
  useLazySearchNewsQuery,
  useRegisterInteractionMutation,
} from '../api/newsApi'
import { FlatList } from 'react-native-gesture-handler'

const ExploreScreen = () => {
  const { colors } = useTheme<Theme>()

  const [searchText, setSearchText] = React.useState<string>('Google')
  const [searchNews, { isFetching, data }] = useLazySearchNewsQuery()
  const [registerInteraction] = useRegisterInteractionMutation()

  const searchNewsDebounced = React.useMemo(() => debounce(searchNews, 800), [])

  React.useEffect(() => {
    ;(async function () {
      try {
        const searchResults = await searchNewsDebounced(searchText).unwrap()
        console.log(searchResults)
      } catch (error) {}
    })()
  }, [searchText])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <Box backgroundColor="mainBackground" flex={1} marginBottom="xl">
        <Box padding="lg" paddingBottom="sm">
          <Text variant="heading1" marginBottom="md">
            Search
          </Text>
          <TextInput
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            icon={<Ionicons name="search" size={18} color={colors.mainText} />}
            additionalStyles={{ height: 50 }}
            placeholder="Type to search..."
            type="text"
            suffix={
              isFetching ? (
                <Box width={20} height={20} marginHorizontal="md">
                  <ActivityIndicator size="small" />
                </Box>
              ) : searchText ? (
                <Pressable onPress={() => setSearchText('')}>
                  <Box
                    width={20}
                    height={20}
                    marginHorizontal={'md'}
                    backgroundColor="mutedText"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={20}
                  >
                    <Ionicons
                      name="close"
                      color={colors.mainBackground}
                      size={16}
                    />
                  </Box>
                </Pressable>
              ) : null
            }
          />
        </Box>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data?.res}
          renderItem={({ item }) => (
            <NewsComponent
              item={item}
              removeItem={(url) => Alert.alert('URL:', url)}
              registerInteraction={(url) =>
                registerInteraction({ url, action: 'READ', effect: 'POSITIVE' })
              }
            />
          )}
          ListEmptyComponent={() =>
            searchText && !isFetching ? (
              <Box flex={1} alignItems="center" justifyContent="center">
                <Text variant="heading2" textAlign="center">
                  Not Found 😢
                </Text>
              </Box>
            ) : null
          }
          style={{ marginBottom: 30 }}
          contentContainerStyle={{ flex: data?.res.length === 0 ? 1 : 0 }}
          keyExtractor={(item) => item.url}
        />
      </Box>
    </SafeAreaView>
  )
}

export default ExploreScreen
