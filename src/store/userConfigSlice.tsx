import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userType: '',
    auth: false,
    phoneNumber: '',
    phoneHint: '',
    email: '',
};

export const userConfigSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { userType, auth, phoneNumber, phoneHint, email } = action.payload;
            state.userType = userType;
            state.auth = auth;
            state.phoneNumber = phoneNumber;
            state.phoneHint = phoneHint;
            state.email = email;
        },
        resetUser: () => initialState,
    },
});

export const { setUser, resetUser } = userConfigSlice.actions;

export default userConfigSlice.reducer;
