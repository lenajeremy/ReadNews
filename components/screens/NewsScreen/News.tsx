import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, Image } from 'react-native'
import { Box, Text } from '../../shared'
import LoadingNews from './LoadingNews'

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

  async function getNews() {
    setIsLoading(true)
    const data = { news: [] }
    //   const { data } = await axios.get('https://readnews-backend.azurewebsites.net/get_news/');
    // console.log(data)
    setNews(data.news)
    setIsLoading(false)
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
      onRefresh={getNews}
      refreshing={isLoading}
      data={news}
      renderItem={({ item }) => (
        <Box flexDirection="row" marginVertical="md" alignItems="center">
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
          <Box width={80} height={80} borderRadius={12} overflow="hidden">
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

export default News;