import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { IState } from '@interfaces/stores/IPopUpReducer';
import type IPopUp from '@interfaces/models/IPopUp';

const initialState: IState = {
    trace: [],
    current: null,
};

const popUpReducer = createSlice({
    name: 'popUp',
    initialState,
    reducers: {
        openPopUp: (state, action: PayloadAction<IPopUp>) => {
            state.trace.push(action.payload);
            state.current = action.payload;
        },

        closePopUp: (state) => {
            state.trace = [];
            state.current = null;
        },

        prevPopUp: (state) => {
            if (state.trace.length <= 1) {
                state.trace = [];
                state.current = null;

                return;
            }

            state.trace.pop();
            state.current = state.trace[state.trace.length - 1];
        },
    },
});

export const { openPopUp, closePopUp, prevPopUp } = popUpReducer.actions;

export default popUpReducer.reducer;
