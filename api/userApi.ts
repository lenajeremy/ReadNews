import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../constants'
import { RootState } from '../redux/store';

const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL, prepareHeaders: (headers, api) => {
            
            const token = (api.getState() as RootState).user.token

            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers;
        }
    }),
    endpoints: (builder) => ({
        // login: builder.mutation<void, { email: string, password: string}>({
        //     query: (body) => ({
        //         url: '/login/',
        //     })
        // })
    })
})

export default userApi;