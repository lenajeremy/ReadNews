import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { useGetAllInterestsQuery, InterestType } from '../api/userApi'
import { Theme } from '../theme'
import { Box, Text } from '../components'
import { useState } from 'react'

const SetInterest = () => {
  const { height: DEVICE_HEIGHT } = useWindowDimensions()
  const { colors, spacing } = useTheme<Theme>()
  const {
    data: interests,
    isLoading,
    isError,
    isSuccess,
  } = useGetAllInterestsQuery()

  return (
    <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
      <Box paddingHorizontal="md" marginTop="xl" marginBottom="lg">
        <Text variant="heading2" lineHeight={36} style={{ width: '85%' }}>
          Your Interests
        </Text>
        <Text
          color="mutedText"
          style={{ width: '85%', marginTop: 2, fontSize: 16 }}
        >
          Select the topics you're interested to help us know the kind of news
          to recommend to you
        </Text>
      </Box>

      <ScrollView
        style={{
          marginHorizontal: spacing.md,
        }}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isSuccess && <AllInterests {...{ interests }} />}

        {isLoading && <ActivityIndicator color={'pink'} />}
      </ScrollView>

      <Box padding="xl" backgroundColor="chocolate" height={100}></Box>
    </SafeAreaView>
  )
}

const AllInterests = ({ interests }: { interests: InterestType[] }) => {
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([])

  const handleToggleInterest = (
    prevSelectedState: boolean,
    interest: InterestType,
  ) => {
    if (prevSelectedState) {
      // the interest is already selected, remove it from the selected interests

      setSelectedInterests(
        selectedInterests.filter((item) => item.id !== interest.id),
      )
    } else {
      // the interest is not selected, add it to the selected interest

      setSelectedInterests([...selectedInterests, interest])
    }
  }

  return (
    <Box flexDirection="row" flexWrap="wrap">
      {interests.map((interest) => (
        <InterestBox
          key={interest.id}
          interest={interest}
          selected={
            selectedInterests.findIndex(
              (_interest) => _interest.name === interest.name,
            ) !== -1
          }
          onToggleSelect={handleToggleInterest}
        />
      ))}
    </Box>
  )
}

const InterestBox = ({
  interest,
  selected,
  onToggleSelect,
}: {
  interest: InterestType
  selected: boolean
  onToggleSelect: (prevSelectedState: boolean, interest: InterestType) => void
}) => {
  return (
    <Box
      pointerEvents="box-none"
      margin="lg"
      backgroundColor={selected ? 'chocolate' : 'success'}
      padding="md"
    >
      <Pressable onPress={() => onToggleSelect(selected, interest)}>
        <Text>{interest.name}</Text>
      </Pressable>
    </Box>
  )
}

const styles = StyleSheet.create({})

export default SetInterest
