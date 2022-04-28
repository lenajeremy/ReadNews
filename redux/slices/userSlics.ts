import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserSliceInterface {
    token: string,
    email: string,
    first_name: string,
    last_name: string,
}

const initialValues: UserSliceInterface = {
    token: '',
    email: '',
    first_name: '',
    last_name: ''
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState: initialValues,
    reducers: {
        updateDetails(state, action: PayloadAction<UserSliceInterface>) {
            state.token = action.payload.token
            state.email = action.payload.email
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
        }
    }
})

export default userSlice

export const { updateDetails } = userSlice.actions