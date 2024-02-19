import {
    type TypedUseSelectorHook,
    useSelector as useReduxSelector,
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authReducer';
import notifyReducer from './notifyReducer';
import popUpReducer from './popUpReducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notify: notifyReducer,
        popUp: popUpReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false });
    },
});

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<IRootState> = useReduxSelector;
