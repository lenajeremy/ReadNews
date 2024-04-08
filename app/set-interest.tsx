import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    useColorScheme,
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { router } from 'expo-router'
import {
    useGetAllInterestsQuery,
    InterestType,
    useAddOrRemoveInterestsMutation,
} from '../api/userApi'
import { Theme } from '../theme'
import { Box, Button, PressableWithHaptics, Text } from '../components'
import React, { useState } from 'react'

const SetInterest = () => {
    const { colors } = useTheme<Theme>()
    const {
        data: interests,
        isLoading,
        isError,
        isSuccess,
    } = useGetAllInterestsQuery()

    const [
        addOrRemoveInterest,
        { isLoading: isAddingInterest },
    ] = useAddOrRemoveInterestsMutation()

    const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([])

    const onSubmit = async () => {
        const res = await addOrRemoveInterest({
            operation: 'add',
            interests: selectedInterests.map((interest) => interest.id),
        }).unwrap()

        console.log(res)

        if (res.success) {
            Alert.alert('Success', res.message)
            router.replace('home/news')
        } else {
            Alert.alert('Failure', res.message)
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
            <Box paddingHorizontal="md" marginTop="xl" marginBottom="lg">
                <Text variant="heading2" lineHeight={36} style={{ width: '85%' }}>
                    Your Interests
                </Text>
                <Text
                    color="mutedText"
                    style={{ width: '95%', marginTop: 4, fontSize: 16 }}
                >
                    Select the topics you're interested to help us know the kind of news
                    to recommend to you
                </Text>
            </Box>

            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 60,
                }}
                showsVerticalScrollIndicator={false}
            >
                {isSuccess && (
                    <AllInterests
                        {...{ interests, selectedInterests, setSelectedInterests }}
                    />
                )}

                {isLoading && <ActivityIndicator color={'pink'} />}
            </ScrollView>

            <Box
                paddingHorizontal="xl"
                marginBottom="lg"
                position="absolute"
                bottom={0}
                paddingBottom={'md'}
                width="100%"
            >
                <Button
                    variant={selectedInterests.length > 3 ? 'contained' : 'disabled'}
                    additionalStyles={{ flex: 1 }}
                    onPress={onSubmit}
                >
                    {isAddingInterest ? (
                        <ActivityIndicator />
                    ) : (
                        <Text fontSize={16} style={{ color: 'white' }}>
                            {selectedInterests.length === 0
                                ? 'Select at least four items'
                                : selectedInterests.length < 4
                                    ? `${4 - selectedInterests.length} items remaining`
                                    : 'Select more or Continue'}
                        </Text>
                    )}
                </Button>
            </Box>
        </SafeAreaView>
    )
}

const AllInterests = ({
    interests,
    setSelectedInterests,
    selectedInterests,
}: {
    setSelectedInterests: React.Dispatch<React.SetStateAction<InterestType[]>>
    selectedInterests: InterestType[]
    interests: InterestType[]
}) => {
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
        <Box
            flexDirection="row"
            flexWrap="wrap"
            paddingHorizontal="md"
            paddingVertical="lg"
            alignItems="center"
            justifyContent="center"
        >
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
    const isDarkMode = useColorScheme() === 'dark'
    const { spacing } = useTheme<Theme>()

    return (
        <Box
            pointerEvents="box-none"
            backgroundColor={selected ? 'chocolate' : 'lightGrayBackground'}
            borderColor={selected ? 'chocolate' : 'mainText'}
            borderWidth={1}
            style={styles.interestBox}
        >
            <PressableWithHaptics
                onPress={() => onToggleSelect(selected, interest)}
                style={{
                    paddingVertical: spacing.sm * 1.2,
                    paddingHorizontal: spacing.lg,
                }}
            >
                <Text
                    color={
                        selected
                            ? 'lightGrayBackground'
                            : isDarkMode
                                ? 'mainBackground'
                                : 'mainText'
                    }
                    variant="body"
                >
                    {interest.name}
                </Text>
            </PressableWithHaptics>
        </Box>
    )
}

const styles = StyleSheet.create({
    interestBox: {
        borderRadius: 20,
        marginHorizontal: 8,
        marginVertical: 8,
    },
})

export default SetInterest
