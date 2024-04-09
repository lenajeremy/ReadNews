import React from 'react'
import { FlatList, Pressable, ActivityIndicator, Alert } from 'react-native'
import { Box, Button, PressableWithHaptics, Text } from '../shared'
import NewsComponent from './NewsComponent'
import Tab from './Tab'
import FeaturedNews from './FeaturedNews'
import { getDateText, getTimeOfDay } from '../../utils'
import {
  useLazyGetNewsQuery,
  useRegisterInteractionMutation,
} from '../../api/newsApi'
import type { NewsType } from '../../types'
import { useAppSelector } from '../../hooks/reduxhooks'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootTabParamList } from '../../navigation/types'

const isNews = (res: any): res is NewsType => {
  return Boolean(res?.url)
}

const News = () => {
  type HeaderElementKeys =
    | 'greetingbanner'
    | 'categories'
    | 'featurednews'
    | 'titleheader'
  type NewsTypeWithKey = NewsType | { _key: HeaderElementKeys }

  const DEFAULT_FLATLIST_HEADER_COMPONENTS: NewsTypeWithKey[] = React.useMemo(() => {
    return [
      { _key: 'greetingbanner' },
      { _key: 'categories' },
      { _key: 'featurednews' },
    ]
  }, [])

  const [allNews, setAllNews] = React.useState<Array<NewsTypeWithKey>>(
    DEFAULT_FLATLIST_HEADER_COMPONENTS,
  )

  const navigation = useNavigation<
    NavigationProp<RootTabParamList, 'NewsScreen'>
  >()

  const map: Record<HeaderElementKeys, React.ReactNode> = {
    greetingbanner: <GreetingBanner key={'greetingbanner'} />,
    categories: (
      <Box marginHorizontal='lg'>
        <Tab
          key={'categories'}
          tabValues={['Feeds', 'Popular', 'Following']}
          initialIndex={0}
          onChange={(e) => console.log(e)}
        />
      </Box>
    ),
    featurednews: <FeaturedNews key={'featurednews'} />,
    titleheader: (
      <Box
        key={'titleheader'}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="md"
        marginTop="lg"
        marginHorizontal="lg"
      >
        <Text
          variant="heading3"
          fontSize={20}
          fontFamily="Gilroy-Bold"
          color="mainText"
        >
          Just For You
        </Text>
        <PressableWithHaptics
          onPress={() => navigation.navigate('ExploreScreen')}
        >
          <Text style={{ color: '#2b7efe' }} fontFamily="Gilroy-Bold">
            See More
          </Text>
        </PressableWithHaptics>
      </Box>
    ),
  }

  const [pageNumber, setPageNumber] = React.useState<number>(1)
  const token = useAppSelector((store) => store.user.token)

  const [
    getNewsFromAPI,
    { isLoading, isFetching, isError },
  ] = useLazyGetNewsQuery()
  const [registerInteraction] = useRegisterInteractionMutation()

  const fetchNews = React.useCallback(
    async function (_pageNumber?: number) {
      try {
        const res = await getNewsFromAPI({
          page_number: _pageNumber ? _pageNumber : pageNumber,
        }).unwrap()

        setAllNews(
          _pageNumber === 1
            ? [...DEFAULT_FLATLIST_HEADER_COMPONENTS, ...res.news]
            : [...allNews, ...res.news],
        )
        setPageNumber(res.nextPage)
      } catch (error) {
        console.error(error)
      }
    },
    [pageNumber, allNews],
  )

  React.useEffect(() => {
    if (token) {
      fetchNews()
    }
  }, [token])

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box flex={1}>
        {Object.entries(map).map((entry) => entry[1])}

        <Box flex={1} alignItems="center">
          <Text marginVertical="md">Error occurred while loading news</Text>
          <Button onPress={() => fetchNews(1)} variant="text">
            <Text>Retry</Text>
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <FlatList
      stickyHeaderIndices={[1]}
      ListFooterComponent={() => (isFetching ? <ActivityIndicator /> : null)}
      ItemSeparatorComponent={({ leadingItem }) =>
        isNews(leadingItem) ? (
          <Box
            height={2}
            width={'100%'}
            backgroundColor="transparentBackground"
          ></Box>
        ) : null
      }
      contentContainerStyle={{
        paddingBottom: isFetching ? 100 : 80,
      }}
      onRefresh={() => fetchNews(1)}
      refreshing={isLoading}
      data={allNews}
      keyExtractor={(item, index) =>
        isNews(item) ? item.url + index.toString() : item._key
      }
      onEndReachedThreshold={0.9}
      onEndReached={() => fetchNews()}
      renderItem={({ item }) => {
        if (isNews(item)) {
          return (
            <NewsComponent
              item={item}
              removeItem={(url) => {
                setAllNews(
                  allNews.filter((news) =>
                    !isNews(news) ? true : news.url !== url,
                  ),
                )
                registerInteraction({
                  url,
                  action: 'DISLIKE',
                  effect: 'POSITIVE',
                })
              }}
              registerInteraction={(url) =>
                registerInteraction({ url, action: 'READ', effect: 'POSITIVE' })
              }
            />
          )
        } else {
          return map[item._key]
        }
      }}
    />
  )
}

const GreetingBanner: React.FC = () => {
  const { firstName } = useAppSelector((store) => store.user)

  return (
    <Box paddingHorizontal="lg" paddingVertical="xs" paddingBottom="md">
      <Text color="mutedText" marginBottom="xs" fontSize={14}>
        {getDateText()}
      </Text>
      <Text variant="heading3" fontFamily="Gilroy-Bold" color="mainText">
        {getTimeOfDay()}, {'\n'}
        {firstName}
      </Text>
    </Box>
  )
}

// const FlatListHeaderComponent = ({
//   animatedCategoriesStyles,
// }: {
//   animatedCategoriesStyles: any
// }) => {
//   const navigation = useNavigation<
//     NavigationProp<RootTabParamList, 'NewsScreen'>
//   >()

//   const components = [
//     <GreetingBanner key={'greetingbanner'} />,
//     <Categories key={'categories'} />,
//     <FeaturedNews key={'featurednews'} />,
//     <Box
//       key={'titleheader'}
//       flexDirection="row"
//       justifyContent="space-between"
//       alignItems="center"
//       marginBottom="md"
//       marginTop="lg"
//       marginHorizontal="lg"
//     >
//       <Text
//         variant="heading3"
//         fontSize={20}
//         fontFamily="Gilroy-Bold"
//         color="mainText"
//       >
//         Just For You
//       </Text>
//       <PressableWithHaptics
//         onPress={() => navigation.navigate('ExploreScreen')}
//       >
//         <Text style={{ color: '#2b7efe' }} fontFamily="Gilroy-Bold">
//           See More
//         </Text>
//       </PressableWithHaptics>
//     </Box>,
//   ]

//   return components
// }

export default News
