import * as React from 'react'
import { Box, Text } from '../shared'
import FeedbackNotifierContext, {
  FeedbackPropsWithoutUpdater,
} from './FeedbackNotifierContext'
import Constants from 'expo-constants'
import Animated from 'react-native-reanimated'

const AnimatedBox = Animated.createAnimatedComponent(Box)

type FeedbackNotifierContainerProps = {
  children: React.ReactNode
}

const FeedbackNotifierContainer = ({
  children,
}: FeedbackNotifierContainerProps) => {
  const [isShowingNotifier, setIsShowingNotifier] = React.useState<boolean>(
    false,
  )

  const [feedbackProps, setFeedbackProps] = React.useState<
    FeedbackPropsWithoutUpdater
  >({
    title: '',
    message: '',
    type: 'success',
  })

  const updateValues = React.useCallback(
    (values: FeedbackPropsWithoutUpdater) => {
      setIsShowingNotifier(true)
      setFeedbackProps(values)
    },
    [],
  )

  return (
    <FeedbackNotifierContext.Provider
      value={{ ...feedbackProps, updateValues }}
    >
      <Box flex={1} position="relative">
        {isShowingNotifier ? (
          <AnimatedBox
            position="absolute"
            zIndex={1000}
            bg="success"
            width={'100%'}
            padding="md"
            style={{ paddingTop: Constants.statusBarHeight }}
          >
            <Text variant="heading3">{feedbackProps.title}</Text>
            <Text>{feedbackProps.message}</Text>
          </AnimatedBox>
        ) : undefined}

        {children}
      </Box>
    </FeedbackNotifierContext.Provider>
  )
}

export default FeedbackNotifierContainer
