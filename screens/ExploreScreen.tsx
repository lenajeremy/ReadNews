import * as React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Image,
} from 'react-native'
import { Box, NewsComponent, Text, TextInput } from '../components'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { Ionicons } from '@expo/vector-icons'
import debounce from '../utils/debounce'
import { useLazySearchNewsQuery } from '../api/newsApi'
import { ScrollView } from 'react-native-gesture-handler'

const ExploreScreen = () => {
  const { colors, spacing } = useTheme<Theme>()

  const [searchText, setSearchText] = React.useState<string>('')
  const [searchNews, { isFetching, data }] = useLazySearchNewsQuery()

  const searchNewsDebounced = React.useMemo(() => debounce(searchNews, 300), [])

  React.useEffect(() => {
    ;(async function () {
      const searchResults = await searchNewsDebounced(searchText).unwrap()
      console.log(searchResults)
    })()
  }, [searchText])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <Box backgroundColor="mainBackground" flex={1} marginBottom="xl">
        <Box padding="lg">
          <Text variant="heading1" marginBottom="md">
            Search
          </Text>
          <TextInput
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            icon={<Ionicons name="search" size={20} color={colors.mainText} />}
            additionalStyles={{ height: 60 }}
            placeholder="Type to search..."
            type="text"
            suffix={
              searchText ? (
                <Pressable onPress={() => setSearchText('')}>
                  <Box
                    width={26}
                    height={26}
                    marginHorizontal={'md'}
                    backgroundColor="mutedText"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={20}
                  >
                    <Ionicons
                      name="close"
                      color={colors.mainBackground}
                      size={20}
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
              registerInteraction={(url) => console.log(url)}
            />
          )}
          ListEmptyComponent={() =>
            searchText && !isFetching ? (
              <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
                marginTop="xl"
              >
                <Image
                  source={require('../assets/images/notfound.png')}
                  style={{ height: 250, width: 250 }}
                />
                <Text variant="heading1" textAlign="center">
                  Not Found 😢
                </Text>
              </Box>
            ) : null
          }
          style={{ marginBottom: 100 }}
          contentContainerStyle={{ marginBottom: 100 }}
          keyExtractor={(item) => item.url}
        />
      </Box>

      {isFetching ? <ActivityIndicator /> : null}
    </SafeAreaView>
  )
}

export default ExploreScreen
