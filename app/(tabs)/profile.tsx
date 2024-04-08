import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import * as React from 'react'
import {
    SafeAreaView,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    ImageBackground,
} from 'react-native'
import { Text, Box, PressableWithHaptics, Tab } from '../../components'
import { useAppSelector } from '../../hooks/reduxhooks'
import { Theme } from '../../theme'
import useLocalStorage from '../../hooks/useLocalStorage'
import { OfflineNewsType } from '../../types'
import { SAVED_NEWS_KEY, LIKED_NEWS_KEY } from '../../constants'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../navigation/types'
// import Settings from './Settings'

const ProfileScreen = () => {
    const { colors } = useTheme<Theme>()
    const { firstName, lastName, email } = useAppSelector((store) => store.user)
    const [profileTabIndex, setProfileTabIndex] = React.useState<0 | 1>(0)
    const [savedNews, updateSavedNews] = useLocalStorage<OfflineNewsType[]>(
        SAVED_NEWS_KEY,
        [],
    )

    const [likedNews, updateLikedNews] = useLocalStorage<OfflineNewsType[]>(
        LIKED_NEWS_KEY,
        [],
    )

    const navigation = useNavigation<NavigationProp<RootStackParamList>>()



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
            <ScrollView>
                <Box backgroundColor="mainBackground" flex={1} paddingHorizontal="lg">
                    <Box
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom='lg'
                        marginTop='md'
                    >
                        <Box flexDirection="row" alignItems="center">
                            <Image
                                source={require('../../assets/images/profile.png')}
                                style={{ width: 34, height: 34 }}
                            />
                            <Box paddingLeft="md">
                                <Text fontFamily="Gilroy" fontSize={18} lineHeight={28}>
                                    {firstName} {lastName}
                                </Text>
                                <Text fontFamily="Gilroy" color="mutedText" lineHeight={16} fontSize={16}>
                                    {email}
                                </Text>
                            </Box>
                        </Box>
                        {/* <PressableWithHaptics
              style={{
                backgroundColor: colors.mainText + 10,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 40,
              }}
            >
              <Text color='mainText' fontSize={14} fontWeight="500">
                Edit profile
              </Text>
            </PressableWithHaptics> */}
                    </Box>

                    <Box marginBottom="lg">
                        <Tab
                            tabValues={['Profile', 'Settings']}
                            onChange={(e, index) => setProfileTabIndex(index as 0 | 1)}
                            initialIndex={profileTabIndex}
                        />
                    </Box>

                    {profileTabIndex === 1 ? (
                        <Text>Setting Should show up here</Text>
                        // <Settings />
                    ) : (
                        <Box>
                            <Box
                                paddingTop="sm"
                                overflow="hidden"
                                style={{ backgroundColor: colors.bottomTabBarBackground + 80 }}
                                borderRadius={12}
                                marginBottom="xl"
                            >
                                <Box
                                    paddingVertical="md"
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    paddingHorizontal="md"
                                >
                                    <Box flexDirection="row" alignItems="center">
                                        <Ionicons
                                            name="bookmark"
                                            size={24}
                                            color={colors.primaryBlue}
                                        />

                                        <Text fontSize={18} fontWeight={'500'} marginLeft="sm">
                                            Saved News ({savedNews?.length})
                                        </Text>
                                    </Box>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={24}
                                        color={colors.mainText}
                                    />
                                </Box>
                                <ScrollView horizontal>
                                    {savedNews?.map((news) => (
                                        <Pressable
                                            onPress={() =>
                                                navigation.navigate('OpenNews', {
                                                    url: news.url,
                                                    favicon: news.metadata.favicon,
                                                    title: news.title,
                                                    website: news.metadata.website,
                                                    img: news.img,
                                                    mode: 'offline',
                                                    content: news.content,
                                                })
                                            }
                                        >
                                            <Box
                                                height={180}
                                                width={250}
                                                position="relative"
                                                backgroundColor="grayBackground"
                                                p="md"
                                                justifyContent="flex-end"
                                            >
                                                <ImageBackground
                                                    source={{ uri: news.img }}
                                                    key={news.url}
                                                    style={StyleSheet.absoluteFillObject}
                                                />
                                                <Text
                                                    fontSize={18}
                                                    lineHeight={28}
                                                    color="mainBackground"
                                                >
                                                    {news.title}
                                                </Text>
                                            </Box>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </Box>

                            <Box
                                paddingTop="sm"
                                overflow="hidden"
                                style={{ backgroundColor: colors.bottomTabBarBackground + 80 }}
                                borderRadius={12}
                                marginBottom="xl"
                            >
                                <Box
                                    paddingVertical="md"
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    paddingHorizontal="md"
                                >
                                    <Box flexDirection="row" alignItems="center">
                                        <Ionicons name="heart" size={24} color={colors.error} />

                                        <Text fontSize={18} fontWeight={'500'} marginLeft="sm">
                                            Liked News ({likedNews?.length})
                                        </Text>
                                    </Box>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={24}
                                        color={colors.mainText}
                                    />
                                </Box>
                                <ScrollView horizontal>
                                    {likedNews?.reverse().map((news) => (
                                        <Pressable
                                            onPress={() =>
                                                navigation.navigate('OpenNews', {
                                                    url: news.url,
                                                    favicon: news.metadata.favicon,
                                                    title: news.title,
                                                    website: news.metadata.website,
                                                    img: news.img,
                                                    mode: 'offline',
                                                    content: news.content,
                                                })
                                            }
                                        >
                                            <Box
                                                height={180}
                                                width={250}
                                                position="relative"
                                                backgroundColor="grayBackground"
                                                p="md"
                                                justifyContent="flex-end"
                                            >
                                                <ImageBackground
                                                    source={{ uri: news.img }}
                                                    key={news.url}
                                                    style={StyleSheet.absoluteFillObject}
                                                />
                                                <Text
                                                    fontSize={18}
                                                    lineHeight={28}
                                                    color="mainBackground"
                                                >
                                                    {news.title}
                                                </Text>
                                            </Box>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </Box>
                        </Box>
                    )}
                </Box>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})

export default ProfileScreen
