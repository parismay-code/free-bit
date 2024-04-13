import { createStore, StateCreator } from 'zustand';
import {
    devtools,
    DevtoolsOptions,
    persist,
    PersistOptions,
} from 'zustand/middleware';
import { PopUp } from './types';

type State = {
    trace: Array<PopUp>;
    current: PopUp | null;
};

type Actions = {
    openPopUp: (data: PopUp) => void;
    closePopUp: () => void;
    prevPopUp: () => void;
};

type PopUpState = State & Actions;

const createPopUpSlice: StateCreator<
    PopUpState,
    [['zustand/devtools', never], ['zustand/persist', unknown]],
    [],
    PopUpState
> = (set) => ({
    trace: [],
    current: null,

    openPopUp: (data) => {
        set(
            (state) => {
                state.trace.push(data);
                state.current = data;

                return state;
            },
            false,
            'openPopUp',
        );
    },

    closePopUp: () => {
        set(
            (state) => {
                state.trace = [];
                state.current = null;

                return state;
            },
            false,
            'closePopUp',
        );
    },

    prevPopUp: () => {
        set(
            (state) => {
                if (state.trace.length <= 1) {
                    state.trace = [];
                    state.current = null;

                    return state;
                }

                state.trace.pop();
                state.current = state.trace[state.trace.length - 1];

                return state;
            },
            false,
            'prevPopUp',
        );
    },
});

const persistOptions: PersistOptions<PopUpState> = { name: 'pop-up' };
const devtoolsOptions: DevtoolsOptions = { name: 'PopUpStore' };

export const popUpStore = createStore<PopUpState>()(
    devtools(persist(createPopUpSlice, persistOptions), devtoolsOptions),
);
