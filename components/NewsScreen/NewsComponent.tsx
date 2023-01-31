import * as React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Pressable, Image } from 'react-native'
import { Box, Text } from '../shared/index'
import { NewsType } from '../../types'

const NewsComponent = ({
  item,
  registerInteraction,
}: {
  item: NewsType
  registerInteraction: (newurl: string) => void
}) => {
  const navigation = useNavigation()

  return (
    <Pressable
      onPress={() => {
        registerInteraction(item.url)
        navigation.navigate('OpenNews', item)
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
    </Pressable>
  )
}

export default React.memo(NewsComponent)
