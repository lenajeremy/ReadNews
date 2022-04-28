import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserSliceInterface {
    token?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
}

const initialValues: UserSliceInterface = {
    token: '',
    email: '',
    firstName: '',
    lastName: ''
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState: initialValues,
    reducers: {
        updateDetails(state, action: PayloadAction<UserSliceInterface>) {
            state.token = action.payload.token
            state.email = action.payload.email
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
        }
    }
})

export default userSlice

export const { updateDetails } = userSlice.actions