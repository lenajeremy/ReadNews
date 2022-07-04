import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../constants'
import { RootState } from '../redux/store';


export interface InterestType {
    name: string,
    id: number,
}

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
        getAllInterests: builder.query<InterestType[] , void>({
            query: () => 'interests/all',
            transformResponse: (res: any) => res.data
        })
    })
})


export const { useGetAllInterestsQuery } = userApi;

export default userApi;