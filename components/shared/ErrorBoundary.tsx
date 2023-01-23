import { Component } from 'react'
import Text from './Text'
import Box from './Box'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

class ErrorBoundary extends Component<
  { onError: VoidFunction; children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  componentDidCatch() {
    this.setState({ hasError: true, errorMessage: 'Some Message' })
    this.props.onError()
  }

  render() {
    return this.props.children
  }
}

export default ErrorBoundary
