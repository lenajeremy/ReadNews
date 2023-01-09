import { Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import * as React from 'react'
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native'
import { Text, Box, BackButton } from '../components'
import { useAppSelector } from '../hooks/reduxhooks'
import { Theme } from '../theme'

const ProfileScreen = () => {
  const { colors } = useTheme<Theme>()
  const { firstName, lastName } = useAppSelector(store => store.user)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <Box backgroundColor="mainBackground" flex={1} paddingHorizontal="lg">
        <Box flexDirection="row" marginVertical="md">
          <BackButton pageName="Profile" />
        </Box>

        <Box>
          <ImageBackground
            source={{
              uri:
                'https://images.unsplash.com/photo-1671725779253-0a5a067cfac4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
            }}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
          <Box width={'100%'} alignItems="center" style={{ marginTop: -63 }}>
            <Box position="relative">
              <Image
                source={{
                  uri:
                    'https://images.unsplash.com/photo-1670525975578-4051a7803c38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
                }}
                resizeMode="cover"
                style={[
                  styles.profileImage,
                  { borderColor: colors.mainBackground },
                ]}
              />
              <Pressable
                style={[
                  styles.editPictureIcon,
                  {
                    backgroundColor: colors.chocolate,
                    borderColor: colors.mainBackground,
                  },
                ]}
              >
                {/* @ts-ignore */}
                <Feather name="edit-2" size={20} color={'white'} />
              </Pressable>
            </Box>
          </Box>
          <Box marginVertical="md">
            <Text
              variant="heading3"
              fontWeight="500"
              textAlign="center"
              fontSize={30}
            >
              {firstName} {lastName}
            </Text>
            <Text
              variant="heading3"
              fontSize={20}
              textAlign="center"
              color="mutedText"
            >
              @jennifer_vars06
            </Text>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: 200,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 6,
  },
  editPictureIcon: {
    borderWidth: 4,
    height: 45,
    width: 45,
    borderRadius: 30,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    right: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ProfileScreen
