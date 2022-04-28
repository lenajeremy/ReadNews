import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../constants'

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL + '/auth' }),
    endpoints: (builder) => ({
        login: builder.mutation<void, { email: string, password: string }>({
            query: (body) => ({
                url: '/login',
                body: body,
            })
        })
    })
})

export default authApi;