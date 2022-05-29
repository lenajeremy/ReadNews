import { Component } from 'react'
import Text from './Text'
import Box from './Box'

class ErrorBoundary extends Component<
  {},
  { hasError: boolean; errorMessage: string }
> {
  constructor(props:any) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: 'Some Message' }
  }

  componentDidCatch() {
      console.log('caught the error')
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text fontSize={40} fontFamily="Blatant-Bold">
          Hello There
        </Text>
      )
    }

    return (
      <>
        <Text>Working fine</Text>
        {this.props.children}
      </>
    )
  }
}

export default ErrorBoundary
