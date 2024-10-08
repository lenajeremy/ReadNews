import * as Linking from 'expo-linking'

export const API_URL = 'https://507d-102-89-46-55.ngrok-free.app'
export const EMAIL_VALIDATION_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
export const FULL_NAME_REGEX = /\w+ \w+/
export const USER_TOKEN_KEY = 'READNEWS_USER_TOKEN'
export const HAS_OPENED_APP = 'HAS_OPENED_READNEWS_APP'
export const SAVED_NEWS_KEY = 'SAVED_NEWS_KEY'
export const LIKED_NEWS_KEY = 'LIKED_NEWS_KEY'
export const PUSH_NOTIFICATION_TOKEN_KEY = 'PUSH_NOTIFICATION_TOKEN_KEY'
export const RECENT_SEARCH_QUERIES_TOKEN_KEY = 'RECENT_SEARCH_QUERIES_TOKEN_KEY'
export const USER_SELECTED_THEME_KEY = 'USER_SELECTED_THEME_KEY'
export const APP_LINKING_BASE_URL = Linking.createURL('/')