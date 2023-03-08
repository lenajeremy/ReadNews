/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
  }
}

export type RootStackParamList = {
  Home: NavigatorScreenParams<RootTabParamList> | undefined
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined
  OpenNews: {
    url: string
    website: string
    favicon: string
    title: string
    img: string
  }
}

export type RootStackScreenProps<
  Screen extends keyof RootStackParamList
> = StackScreenProps<RootStackParamList, Screen>

export type AuthStackParamList = {
  Onboarding: undefined
  Login: undefined
  Register: undefined
  SetInterest: undefined
  RequestPasswordReset: undefined
  ResetPassword: {
    passwordResetToken: string
    userId: string
  }
}

export type AuthStackScreenProps<
  Screen extends keyof AuthStackParamList
> = StackScreenProps<AuthStackParamList, Screen>

export type RootTabParamList = {
  NewsScreen: undefined
  ExploreScreen: undefined
  ProfileScreen: undefined
}

export type RootTabScreenProps<
  Screen extends keyof RootTabParamList
> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  StackScreenProps<RootStackParamList>
>
