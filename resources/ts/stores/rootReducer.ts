import {
    type TypedUseSelectorHook,
    useSelector as useReduxSelector,
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@stores/authReducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<IRootState> = useReduxSelector;
