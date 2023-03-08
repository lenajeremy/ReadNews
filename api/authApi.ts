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
            })
        }),
        register: builder.mutation<void, { email: string, password: string, fullName: string }>({
            query: (body) => ({
                url: '/register/',
                method: 'POST',
                body: body
            })
        }),
        loginWithToken: builder.query<{ data: { email?: string, token?: string, first_name?: string, last_name?: string, hasSetInterests: boolean } }, string>({
            query: (token) => ({
                url: '/api/token/verify/',
                params: { token },
            })
        }),
        requestPasswordToken: builder.query<void, { email: string, host: string, route: string }>({
            query: (args) => ({
                url: '/request-password-reset/',
                params: args
            })
        }),
        resetPassword: builder.mutation<void, { newPassword: string, confirmNewPassword: string, userId: string, resetPasswordToken: string }>({
            query: (args) => ({
                url: `/reset-password/${String(args.userId)}/${args.resetPasswordToken}/`,
                method: 'POST',
                body: {
                    new_password: args.newPassword,
                    confirm_new_password: args.confirmNewPassword,
                    reset_token: args.resetPasswordToken,
                    user_id: args.userId,
                }
            })
        })
    })
})

export default authApi;

export const {
    useLoginMutation,
    useRegisterMutation,
    useLazyLoginWithTokenQuery,
    useLazyRequestPasswordTokenQuery,
    useResetPasswordMutation,
} = authApi;