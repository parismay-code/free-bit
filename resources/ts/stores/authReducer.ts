import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { IState } from '@interfaces/stores/IAuthReducer';
import type { IFullUser } from '@interfaces/models/IUser';

const localStorageUser = localStorage.getItem('user');

const initialState: IState = {
    user: localStorageUser ? JSON.parse(localStorageUser) : null,
};

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IFullUser | false>) => {
            state.user = action.payload;

            if (!action.payload) {
                localStorage.removeItem('user');
                return;
            }

            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
});

export const { setUser } = authReducer.actions;

export default authReducer.reducer;
