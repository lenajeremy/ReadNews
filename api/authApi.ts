import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../constants'

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL + '/auth' }),
    endpoints: (builder) => ({
        login: builder.mutation<{ data: { email?: string, token?: string, first_name?: string, last_name?: string, hasSetInterests: boolean } }, { email: string, password: string }>({
            query: (body) => ({
                url: '/login/',
                method: 'POST',
                body: body,
                headers: {
                    Authorization: "Something interesting",
                }
            })
        }),
        register: builder.mutation<void, { email: string, password: string, fullName: string }>({
            query: (body) => ({
                url: '/register/',
                method: 'POST',
                body: body
            })
        })
    })
})

export default authApi;

export const { useLoginMutation, useRegisterMutation } = authApi;