import * as Linking from 'expo-linking'

// export const API_URL = 'http://iroyin-backend-env.eba-wmgpq2d7.us-west-2.elasticbeanstalk.com'
export const API_URL = 'https://a2d9-102-89-34-36.eu.ngrok.io'
export const EMAIL_VALIDATION_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
export const FULL_NAME_REGEX = /\w+ \w+/
export const USER_TOKEN_KEY = 'READNEWS_USER_TOKEN'
export const HAS_OPENED_APP = 'HAS_OPENED_READNEWS_APP'
export const PUSH_NOTIFICATION_TOKEN_KEY = 'PUSH_NOTIFICATION_TOKEN_KEY'
export const RECENT_SEARCH_QUERIES_TOKEN_KEY = 'RECENT_SEARCH_QUERIES_TOKEN_KEY'
export const APP_LINKING_BASE_URL = Linking.createURL('/')