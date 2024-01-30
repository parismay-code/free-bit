import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { IState } from '@interfaces/stores/INotifyReducer';
import type INotify from '@interfaces/models/INotify';

const initialState: IState = {
    queue: [],
};

const notifyReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addNotify: (state, action: PayloadAction<INotify>) => {
            state.queue.push(action.payload);
        },

        removeNotify: (state) => {
            state.queue.shift();
        },
    },
});

export const { addNotify, removeNotify } = notifyReducer.actions;

export default notifyReducer.reducer;
