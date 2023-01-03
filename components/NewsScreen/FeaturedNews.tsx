import React from 'react'
import {
  useWindowDimensions,
  StyleSheet,
  ScrollView,
  Image,
  useColorScheme,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Box, Text } from '../shared'

const FeaturedNews: React.FC = () => {
  const featuredNews = [
    {
      title: 'Designed by Nutritionists, Crafted by Chefs',
      imageURL:
        'https://media-assets.thistle.co/lifestyle/thistle-delivery-bag-resized-2.jpg',
      metaData: {
        websiteIcon: 'https://unsplash.com/apple-touch-icon.png',
        websiteName: 'Unsplash',
      },
      tags: ['Improvement', 'Confidence', 'People'],
    },
    {
      title: 'How to Fork a GitHub Repository – A Complete Workflow',
      imageURL: 'https://media-assets.thistle.co/cobb-salad-800px.jpg',
      metaData: {
        websiteIcon:
          'https://cdn.freecodecamp.org/universal/favicons/favicon.ico',
        websiteName: 'FreeCodeCamp',
      },
      tags: ['GitHub', 'Programming'],
    },
    {
      title:
        'Check Out the Newly Announced Samsung Galaxy S22 Smartphones and Galaxy Tab S8 Tablets',
      imageURL:
        'https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,pg_1,q_60,w_965/834111d4808a548c33c090150bd4e73c.jpg',
      metaData: {
        websiteIcon:
          'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_80,q_80,w_80/fdj3buryz5nuzyf2k620.png',
        websiteName: 'GizModo',
      },
      tags: ['GitHub', 'Programming'],
    },
  ]

  const { width: DEVICE_WIDTH } = useWindowDimensions()
  const isDarkMode = useColorScheme() === 'dark'

  const styles = StyleSheet.create({
    featuredNewsContainer: {
      width: DEVICE_WIDTH * 0.8,
      height: 240,
      marginRight: 16,
      justifyContent: 'space-between',
      overflow: 'hidden',
      borderRadius: 16
    },
  })

  return (
    <Box paddingLeft="lg" marginVertical="md" marginTop="sm">
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {featuredNews.map((news) => (
          <Box
            key={news.title}
            style={styles.featuredNewsContainer}
            padding="md"
          >
            <Image
              source={{ uri: news.imageURL }}
              style={{ ...StyleSheet.absoluteFillObject }}
            />

            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
              locations={[0, 0.7]}
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 8,
              }}
            />

            <Box flexDirection="row">
              {news.tags.map((tag, index) => (
                <Box
                  key={index}
                  backgroundColor="lightGrayBackground"
                  padding="xxs"
                  paddingHorizontal="sm"
                  borderRadius={10}
                  marginHorizontal="xxs"
                >
                  <Text color="grayBackground" fontSize={12}>
                    {tag}
                  </Text>
                </Box>
              ))}
            </Box>
            <Box alignItems="flex-start">
              <Image
                source={{ uri: news.metaData.websiteIcon }}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
              <Text
                color={isDarkMode ? 'mainText' : 'mainBackground'}
                variant="heading3"
                fontFamily="Gilroy-Bold"
                marginTop="sm"
                fontSize={20}
                lineHeight={32}
              >
                {news.title}
              </Text>
            </Box>
          </Box>
        ))}
      </ScrollView>
    </Box>
  )
}

export default FeaturedNews
