import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, Image } from 'react-native'
import { Box, Text } from '../shared'
import LoadingNews from './LoadingNews'
import axios from 'axios'
import Categories from './Categories'
import FeaturedNews from './FeaturedNews'
import { getDateText, getTimeOfDay } from '../../utils/dateutils'

import { useAnimatedStyle, useAnimatedGestureHandler, useSharedValue } from 'react-native-reanimated'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'

const News = () => {
  type NewsType = {
    title: string
    url: string
    img: string
    metadata: {
      favicon: string
      website: string
    }
  }

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [news, setNews] = useState<NewsType[]>([])

  const translateX = useSharedValue(0);

  async function getNews() {
    setIsLoading(true)

    try {
      const { data } = await axios.get(
        'https://readnews-backend.herokuapp.com/news/get_news/',
      )
      console.log(data)
      setNews(data.news)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getNews()
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

  const registerInteraction = async (url: string) => {
    const { data } = await axios.post(
      'https://iroyin.herokuapp.com/indicate_news_interaction/',
      {
        news_url: url,
      },
    )
    console.log(data)
    if (data.success) {
      Alert.alert('Success', 'Interaction successfully recorded')
    } else {
      Alert.alert('Error', 'Interaction was not successfully recorded')
    }
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
      onRefresh={getNews}
      refreshing={isLoading}
      data={news}
      keyExtractor={(item, index) => item.url + index.toString()}
      renderItem={({ item }) => (
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
                fontFamily="Inter-SemiBold"
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
      )}
    />
  )
}

const GreetingBanner: React.FC = () => {
  return (
    <Box paddingHorizontal="lg" paddingVertical="sm">
      <Text color="mutedText" marginBottom="xs" fontSize={14}>
        {getDateText()}
      </Text>
      <Text variant="heading3" fontFamily="Inter-SemiBold" color="mainText">
        {getTimeOfDay()}, {'\n'}Jeremiah
      </Text>
    </Box>
  )
}

const FlatListHeaderComponent = () => (
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
        fontFamily="Inter-Bold"
        color="mainText"
      >
        Just For You
      </Text>
      <Pressable onPress={() => Alert.alert('hello', 'someting is happening')}>
        <Text style={{ color: '#2b7efe' }} fontFamily="Inter-SemiBold">
          See More
        </Text>
      </Pressable>
    </Box>
  </>
)

export default News
