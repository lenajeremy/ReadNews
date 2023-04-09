import * as React from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native'
import {
  Box,
  NewsComponent,
  PressableWithHaptics,
  Text,
  TextInput,
} from '../components'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import {
  AntDesign,
  EvilIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons'
import { useDebounce } from '../utils'
import {
  useLazySearchNewsQuery,
  useRegisterInteractionMutation,
} from '../api/newsApi'
import { FlatList } from 'react-native-gesture-handler'
import useLocalStorage from '../hooks/useLocalStorage'
import { RECENT_SEARCH_QUERIES_TOKEN_KEY } from '../constants'

const ExploreScreen = () => {
  const { colors } = useTheme<Theme>()

  const [searchText, setSearchText] = React.useState<string>('')
  const [searchNews, { isFetching, data }] = useLazySearchNewsQuery()
  const [registerInteraction] = useRegisterInteractionMutation()
  const [recentQueries, updateRecentQueries] = useLocalStorage<string[]>(
    RECENT_SEARCH_QUERIES_TOKEN_KEY,
    [],
  )
  const MAX_QUERY_LENGTH = 10

  const searchForNewsAndUpdateSearchQueries = React.useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim()) {
        try {
          const res = await searchNews(searchQuery).unwrap()
          if (res) {
            const previousQueries = new Set(recentQueries)
            previousQueries.add(searchQuery)
            if (previousQueries.size > MAX_QUERY_LENGTH) {
              previousQueries.delete(Array.from(previousQueries)[0])
            }

            updateRecentQueries(Array.from(previousQueries))
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    [recentQueries],
  )

  const [searchNewsAndUpdateQueriesDebounced] = useDebounce(
    searchForNewsAndUpdateSearchQueries,
    600,
    '' as any,
  )

  React.useEffect(() => {
    ;(async function () {
      try {
        await searchNewsAndUpdateQueriesDebounced(searchText)
      } catch (error) {
        console.log('there is an error', error)
      }
    })()
  }, [searchText])

  const removeQuery = React.useCallback((queryText: string) => {
    const set = new Set(recentQueries)
    set.delete(queryText)
    updateRecentQueries(Array.from(set))
  }, [recentQueries])

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
        {searchText === '' && recentQueries ? (
          <RecentQueries
            queries={recentQueries}
            onClick={(queryText: string) => setSearchText(queryText)}
            removeQuery={removeQuery}
          />
        ) : (
          <FlatList
            ItemSeparatorComponent={() => (
              <Box
                height={2}
                width={'100%'}
                backgroundColor="transparentBackground"
              />
            )}
            showsVerticalScrollIndicator={false}
            data={data?.res}
            renderItem={({ item }) => (
              <NewsComponent
                item={item}
                removeItem={(url) => Alert.alert('URL:', url)}
                registerInteraction={(url) =>
                  registerInteraction({
                    url,
                    action: 'READ',
                    effect: 'POSITIVE',
                  })
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
        )}
      </Box>
    </SafeAreaView>
  )
}

const RecentQueries = ({
  queries,
  onClick,
  removeQuery,
}: {
  removeQuery: (queryText: string) => void
  queries: string[]
  onClick: (queryText: string) => void
}) => {
  const { colors } = useTheme<Theme>()
  return (
    <Box padding="lg" paddingTop="sm">
      <Text fontSize={20} fontWeight="600" mt="sm" my={'md'}>
        Recent Searches
      </Text>

      {queries.length > 0 ? (
        <ScrollView>
          {queries.map((query) => (
            <Box
              flexDirection="row"
              alignItems="center"
              marginBottom="sm"
              padding="xxs"
              justifyContent="space-between"
            >
              <Box flexDirection="row">
                <Box
                  // @ts-ignore
                  borderRadius={'50%'}
                  borderColor={'transparentBackground'}
                  borderWidth={1.5}
                  width={30}
                  height={30}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <AntDesign
                    name="search1"
                    size={16}
                    color={colors.mutedText}
                  />
                </Box>
                <Text
                  key={query}
                  paddingVertical="xs"
                  marginLeft="md"
                  onPress={() => onClick(query)}
                >
                  {query}
                </Text>
              </Box>

              <PressableWithHaptics onPress={() => removeQuery(query)}>
                <AntDesign name="close" size={16} color={colors.mutedText} />
              </PressableWithHaptics>
            </Box>
          ))}
        </ScrollView>
      ) : (
        <Text>No recent searches</Text>
      )}
    </Box>
  )
}
export default ExploreScreen
