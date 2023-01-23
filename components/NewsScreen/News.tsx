import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, ActivityIndicator } from 'react-native'
import { Box, Text } from '../shared'
import NewsComponent from './NewsComponent'
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
import { RootTabParamList } from '../../navigation/types'

const News = () => {
  const [allNews, setAllNews] = React.useState<NewsType[]>([])
  const [pageNumber, setPageNumber] = React.useState<number>(1)

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

        setAllNews(
          _pageNumber === 1 ? [...res.news] : [...allNews, ...res.news],
        )
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
      ListFooterComponent={() => (isFetching ? <ActivityIndicator /> : null)}
      ItemSeparatorComponent={() => (
        <Box
          height={3}
          width={'100%'}
          backgroundColor="transparentBackground"
        ></Box>
      )}
      contentContainerStyle={{
        paddingBottom: isFetching ? 100 : 80,
      }}
      onRefresh={() => fetchNews(1)}
      refreshing={isFetching}
      data={allNews}
      keyExtractor={(item, index) => item.url + index.toString()}
      onEndReachedThreshold={0.9}
      onEndReached={() => fetchNews()}
      renderItem={({ item }) => (
        <NewsComponent item={item} registerInteraction={registerInteraction} />
      )}
    />
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
