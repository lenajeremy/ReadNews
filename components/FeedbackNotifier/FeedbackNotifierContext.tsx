import * as React from 'react'

export type FeedbackProps = {
  type: 'error' | 'warning' | 'success'
  message: string
  title: string
  updateValues: (values: Omit<FeedbackProps, 'updateValues'>) => void
}

export type FeedbackPropsWithoutUpdater = Omit<FeedbackProps, 'updateValues'>

const FeedbackNotifierContext = React.createContext<FeedbackProps>({
  type: 'success',
  message: '',
  title: '',
  updateValues: () => {},
})

export default FeedbackNotifierContext
