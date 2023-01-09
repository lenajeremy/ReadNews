import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, Image, ScrollView } from 'react-native'
import { Box, Text } from '../shared'
import LoadingNews from './LoadingNews'
import Categories from './Categories'
import FeaturedNews from './FeaturedNews'
import { getDateText, getTimeOfDay } from '../../utils/dateutils'
import {
  useLazyGetNewsQuery,
  useRegisterInteractionMutation,
} from '../../api/newsApi'
import type { NewsType } from '../../types'
import { useAppSelector } from '../../hooks/reduxhooks'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList, RootTabParamList } from '../../navigation/types'
import { isLoading } from 'expo-font'

const News = () => {
  const [allNews, setAllNews] = React.useState<NewsType[]>([])
  const [pageNumber, setPageNumber] = React.useState<number>(1)
  const user = useAppSelector((store) => store.user)

  const [
    getNewsFromAPI,
    { isLoading, isFetching, error, data: news = { news: [] }, isSuccess },
  ] = useLazyGetNewsQuery()

  const [registerInteraction] = useRegisterInteractionMutation()

  const fetchNews = React.useCallback(
    async function (_pageNumber?: number) {
      console.log('calling api')
      try {
        const res = await getNewsFromAPI({
          page_number: _pageNumber ? _pageNumber : pageNumber,
        }).unwrap()

        setAllNews([...allNews, ...res.news])
        setPageNumber(res.nextPage)
      } catch (error) {
        console.error(error)
      }
    },
    [pageNumber],
  )

  React.useEffect(() => {
    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <Box>
        <LoadingNews />
        <LoadingNews />
        <LoadingNews />
        <LoadingNews />
      </Box>
    )
  }

  return (
    <FlatList
      ListHeaderComponent={FlatListHeaderComponent}
      ItemSeparatorComponent={() => (
        <Box
          height={3}
          width={'100%'}
          backgroundColor="transparentBackground"
        ></Box>
      )}
      onRefresh={() => fetchNews(1)}
      refreshing={isFetching}
      data={news.news}
      keyExtractor={(item, index) => item.url + index.toString()}
      onEndReachedThreshold={0.9}
      onEndReached={() => fetchNews()}
      renderItem={({ item }) => (
        <NewsComponent item={item} registerInteraction={registerInteraction} />
      )}
    />
  )
}

const NewsComponent = ({
  item,
  registerInteraction,
}: {
  item: NewsType
  registerInteraction: (newurl: string) => void
}) => {
  return (
    <Box
      flexDirection="row"
      marginVertical="lg"
      alignItems="center"
      marginHorizontal="lg"
    >
      <Box flex={2.5} marginRight="lg">
        <Pressable onPress={() => registerInteraction(item.url)}>
          <Text
            color="mainText"
            fontSize={18}
            lineHeight={26}
            fontFamily="Gilroy-Bold"
          >
            {item.title.length >= 65
              ? item.title.slice(0, 62) + '...'
              : item.title}
          </Text>
        </Pressable>
        <Box flexDirection="row" paddingVertical="sm">
          <Image
            source={{ uri: item.metadata.favicon }}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              marginRight: 10,
            }}
          />
          <Text color="mutedText" fontSize={13}>
            {item.metadata.website}
          </Text>
        </Box>
      </Box>
      <Box width={90} height={90} borderRadius={12} overflow="hidden">
        <Image
          source={{ uri: item.img }}
          style={{ height: '100%', width: '100%' }}
          resizeMode="cover"
        />
      </Box>
    </Box>
  )
}

const GreetingBanner: React.FC = () => {
  const { firstName } = useAppSelector((store) => store.user)

  return (
    <Box paddingHorizontal="lg" paddingVertical="sm">
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

const FlatListHeaderComponent = () => {
  const navigation = useNavigation<
    NavigationProp<RootTabParamList, 'NewsScreen'>
  >()

  return (
    <>
      <GreetingBanner />
      <Categories />
      <FeaturedNews />
      <Box
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
        <Pressable onPress={() => navigation.navigate('ExploreScreen')}>
          <Text style={{ color: '#2b7efe' }} fontFamily="Gilroy-Bold">
            See More
          </Text>
        </Pressable>
      </Box>
    </>
  )
}

export default News
