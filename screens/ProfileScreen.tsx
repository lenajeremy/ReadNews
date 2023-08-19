import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import * as React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Switch,
  ScrollView,
  ImageBackground,
} from 'react-native'
import { Text, Box, PressableWithHaptics, Tab } from '../components'
import { useAppSelector } from '../hooks/reduxhooks'
import { Theme } from '../theme'
import * as Updates from 'expo-updates'
import localStorage from '../utils/localStorage'
import useLocalStorage from '../hooks/useLocalStorage'
import { OfflineNewsType } from '../types'
import { SAVED_NEWS_KEY, LIKED_NEWS_KEY } from '../constants'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/types'

const ProfileScreen = () => {
  const { colors } = useTheme<Theme>()
  const { firstName, lastName, email } = useAppSelector((store) => store.user)
  const [profileTabIndex, setProfileTabIndex] = React.useState<0 | 1>(1)
  const [savedNews, updateSavedNews] = useLocalStorage<OfflineNewsType[]>(
    SAVED_NEWS_KEY,
    [],
  )

  const [likedNews, updateLikedNews] = useLocalStorage<OfflineNewsType[]>(
    LIKED_NEWS_KEY,
    [],
  )

  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const logout = function () {
    localStorage.clear()

    // logging out also has to invalidate the token from the backend
    Updates.reloadAsync()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <ScrollView>
        <Box backgroundColor="mainBackground" flex={1} paddingHorizontal="lg">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginVertical={'xl'}
          >
            <Box flexDirection="row" alignItems="center">
              <Image
                source={require('../assets/images/profile.png')}
                style={{ width: 40, height: 40 }}
              />
              <Box paddingLeft="md">
                <Text fontFamily="Blatant" fontSize={24} lineHeight={28}>
                  {firstName} {lastName}
                </Text>
                <Text color="mutedText" lineHeight={16} fontSize={16}>
                  {email}
                </Text>
              </Box>
            </Box>
            <PressableWithHaptics
              style={{
                backgroundColor: colors.chocolate + 25,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 40,
              }}
            >
              <Text color="chocolate" fontSize={14} fontWeight="500">
                Edit profile
              </Text>
            </PressableWithHaptics>
          </Box>

          <Box marginBottom="xl">
            <Tab
              tabValues={['Profile', 'Settings']}
              onChange={(e, index) => setProfileTabIndex(index as 0 | 1)}
              initialIndex={profileTabIndex}
            />
          </Box>

          {profileTabIndex === 1 ? (
            <Box>
              <Box
                paddingHorizontal="md"
                paddingVertical="sm"
                style={{ backgroundColor: colors.bottomTabBarBackground + 80 }}
                borderRadius={12}
                marginBottom="xl"
              >
                <Box
                  paddingVertical="md"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal="sm"
                >
                  <Box flexDirection="row" alignItems="center">
                    <Ionicons
                      name="moon-outline"
                      size={20}
                      color={colors.mainText}
                    />
                    <Text marginLeft={'md'} fontSize={16}>
                      Dark Mode
                    </Text>
                  </Box>

                  <Switch
                    trackColor={{ true: colors.chocolate }}
                    value={true}
                  />
                </Box>

                <Box
                  width={'100%'}
                  height={1}
                  backgroundColor="transparentBackground"
                />

                <Box
                  paddingVertical="md"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal="sm"
                >
                  <Box flexDirection="row" alignItems="center">
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color={colors.mainText}
                    />
                    <Text marginLeft={'md'} fontSize={16}>
                      Notifications
                    </Text>
                  </Box>

                  <Switch
                    trackColor={{ true: colors.chocolate }}
                    value={false}
                  />
                </Box>

                <Box
                  width={'100%'}
                  height={1}
                  backgroundColor="transparentBackground"
                />

                <Box
                  paddingVertical="md"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal="sm"
                >
                  <Box flexDirection="row" alignItems="center">
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color={colors.mainText}
                    />
                    <Text marginLeft={'md'} fontSize={16}>
                      Notifications
                    </Text>
                  </Box>

                  <Switch
                    trackColor={{ true: colors.chocolate }}
                    value={false}
                  />
                </Box>
              </Box>

              <Box
                paddingHorizontal="md"
                paddingVertical="sm"
                style={{ backgroundColor: colors.bottomTabBarBackground + 80 }}
                borderRadius={12}
              >
                <Pressable onPress={logout}>
                  <Box
                    paddingVertical="md"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal="sm"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Ionicons
                        name="log-out-outline"
                        size={20}
                        color={colors.error}
                      />
                      <Text marginLeft={'md'} fontSize={16} color="error">
                        Logout
                      </Text>
                    </Box>
                  </Box>
                </Pressable>

                <Box
                  width={'100%'}
                  height={1}
                  backgroundColor="transparentBackground"
                />

                <Box
                  paddingVertical="md"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal="sm"
                >
                  <Box flexDirection="row" alignItems="center">
                    <Ionicons
                      name="trash-bin-outline"
                      size={20}
                      color={colors.error}
                    />
                    <Text marginLeft={'md'} fontSize={16} color="error">
                      Delete Account
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
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
