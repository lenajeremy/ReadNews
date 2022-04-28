import { configureStore } from "@reduxjs/toolkit";
import authApi from "../api/authApi";
import newsApi from "../api/newsApi";
import userApi from "../api/userApi";
import userSlice from "./slices/userSlics";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
        'user': userSlice.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([authApi.middleware, userApi.middleware])
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
