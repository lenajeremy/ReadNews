import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../constants'
import { RootState } from '../redux/store'

import { NewsType } from '../types'


const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL, prepareHeaders: (headers, api) => {

            const token = (api.getState() as RootState).user.token

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            // console.log(headers);


            return headers;
        }
    }),
    endpoints: (builder) => ({
        getNews: builder.query<{ news: NewsType[], currentPage: number, nextPage: number, perPage: number, totalPages: number }, { page_number: number }>({
            query: (args) => ({
                url: '/news/get_news',
                params: {
                    news_per_page: 10,
                    page_number: args.page_number
                },
            }),
            transformResponse: (res: any) => ({
                news: res.news,
                currentPage: res.current_page,
                nextPage: res.next_page,
                perPage: res.per_page,
                totalPages: res.total_pages,
            })
        }),
        registerInteraction: builder.mutation<void, string>({
            query: (url) => ({
                url: 'news/indicate_interaction/',
                body: {
                    news_url: url,
                },
                method: "POST"
            })
        })
    })
})

export default newsApi;

export const { useLazyGetNewsQuery, useGetNewsQuery, useRegisterInteractionMutation } = newsApi;