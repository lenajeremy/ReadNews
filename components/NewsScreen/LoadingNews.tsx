import { useTheme } from '@shopify/restyle'
import { Dimensions, useColorScheme } from 'react-native'

import { Theme } from '../../theme'
import { Text } from '../shared'

const LoadingNews: React.FC = () => {
  const { colors } = useTheme<Theme>()
  const { width: DEVICE_WIDTH } = Dimensions.get('window')
  const isDarkMode = useColorScheme() === 'dark'

  return (
    //     <SkeletonPlaceholder
    //     backgroundColor={isDarkMode ? '#444' : '#33333340'}
    //     highlightColor={
    //         isDarkMode ? colors.transparentBackground : colors.grayBackground
    //     }
    //     speed={2000}
    //     >
    //     <SkeletonPlaceholder.Item
    //         marginBottom={15}
    //         flexDirection="row"
    //         alignItems="center"
    //         justifyContent="space-between"
    //     >
    //         <SkeletonPlaceholder.Item>
    //         <SkeletonPlaceholder.Item
    //             width={(DEVICE_WIDTH - 48) * 0.65}
    //             height={30}
    //             borderRadius={5}
    //             marginBottom={10}
    //         />
    //         <SkeletonPlaceholder.Item
    //             height={10}
    //             width={(DEVICE_WIDTH - 48) * 0.55}
    //         />
    //         </SkeletonPlaceholder.Item>

    //         <SkeletonPlaceholder.Item width={60} height={60} borderRadius={15} />
    //     </SkeletonPlaceholder.Item>
    // </SkeletonPlaceholder>

    <Text>Loading</Text>
  )
}

export default LoadingNews
