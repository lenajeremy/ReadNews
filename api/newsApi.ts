import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../constants'
import { RootState } from '../redux/store'
import { NewsType } from '../types'


const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL, prepareHeaders: (headers, api) => {

            const token = (api.getState() as RootState).user.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        }
    }),
    tagTypes: ['NEWS_DETAILS'],
    endpoints: (builder) => ({
        getNewsContent: builder.query<{
            title: string,
            img: string,
            url: string,
            metadata: {
                website: string,
                favicon: string,
                time_added: string
            },
            text: string,
            isLiked: boolean,
            isSaved: boolean
        }, string>({
            query: (url) => ({
                url: '/news/get-details/',
                params: { url }
            }),
            transformResponse: (res: any) => {
                return {
                    title: res.title,
                    img: res.img,
                    url: res.url,
                    metadata: res.metadata,
                    text: res.text_content,
                    isLiked: res.is_liked,
                    isSaved: res.is_saved
                };
            },
            providesTags: (res, err, url) => ([{ type: 'NEWS_DETAILS', id: url }])
        }),
        registerInteraction: builder.mutation<void, { url: string, action?: 'READ' | 'SAVE' | 'LIKE' | 'SHARE' | 'DISLIKE', effect?: 'POSITIVE' | 'NEGATIVE' }>({
            query: (args) => ({
                url: 'news/indicate_interaction/',
                body: {
                    effect: args.effect,
                    action: args.action,
                    news_url: args.url
                },
                method: "POST"
            }),
            invalidatesTags: (res, err, args) => ([{ type: 'NEWS_DETAILS', id: args.url }])
        }),
        searchNews: builder.query<{ res: NewsType[] }, string>({
            query: (title) => ({
                url: '/news/search/',
                params: { title }
            })
        }),
        getNews: builder.query<{ news: NewsType[], currentPage: number, nextPage: number, perPage: number, totalPages: number }, { page_number: number }>({
            query: (args) => ({
                url: '/news/get_news/',
                params: {
                    news_per_page: 20,
                    page_number: args.page_number
                }
            }),
            transformResponse: (res: any) => ({
                news: res.news,
                currentPage: res.current_page,
                nextPage: res.next_page,
                perPage: res.per_page,
                totalPages: res.total_pages
            })
        }),
    })
})

export default newsApi;

export const {
    useLazyGetNewsQuery,
    useGetNewsQuery,
    useRegisterInteractionMutation,
    useGetNewsContentQuery,
    useLazySearchNewsQuery
} = newsApi;