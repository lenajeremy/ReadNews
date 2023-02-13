import * as React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Image } from 'react-native'
import { Box, PressableWithHaptics, Text } from '../shared/index'
import { NewsType } from '../../types'
// @ts-ignore
// import Image from 'expo-cached-image'

const NewsComponent = ({
  item,
  registerInteraction,
}: {
  item: NewsType
  registerInteraction: (newurl: string) => void
}) => {
  const navigation = useNavigation()

  return (
    <PressableWithHaptics
      onPress={() => {
        registerInteraction(item.url)
        navigation.navigate('OpenNews', {
          url: item.url,
          img: item.img,
          favicon: item.metadata.favicon,
          website: item.metadata.website,
          title: item.title,
        })
      }}
    >
      <Box
        flexDirection="row"
        marginVertical="lg"
        alignItems="center"
        marginHorizontal="lg"
      >
        <Box flex={2.5} marginRight="lg">
          <Text
            color="mainText"
            fontSize={18}
            lineHeight={26}
            fontFamily="Gilroy-Bold"
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>

          <Box flexDirection="row" paddingVertical="sm">
            <Image
              source={{ uri: item.metadata.favicon }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                marginRight: 10,
                backgroundColor: 'gray',
              }}
            />
            <Text color="mutedText" fontSize={13}>
              {item.metadata.website}
            </Text>
          </Box>
        </Box>
        <Box width={90} height={90} borderRadius={12} overflow="hidden">
          <Image
            source={{ uri: item.img, expiresIn: 1800 }}
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'lightgray',
            }}
            resizeMode="cover"
            cacheKey={item.img}
          />
        </Box>
      </Box>
    </PressableWithHaptics>
  )
}

export default React.memo(NewsComponent)
