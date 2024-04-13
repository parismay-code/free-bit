import Echo from 'laravel-echo';
import Pusher, { AuthorizerCallback, Channel } from 'pusher-js';
import { createStore, StateCreator } from 'zustand';
import {
    devtools,
    DevtoolsOptions,
    persist,
    PersistOptions,
} from 'zustand/middleware';
import env from '~shared/lib/env';
import { authBroadcastingMutation } from './api';
import { Notify } from './types';

type State = {
    readonly echo: Echo;
    queue: Array<Notify>;
};

type Actions = {
    addNotify: (data: Notify) => void;
    removeNotify: () => void;
};

type NotifyState = State & Actions;

const createNotifySlice: StateCreator<
    NotifyState,
    [['zustand/devtools', never], ['zustand/persist', unknown]],
    [],
    NotifyState
> = (set) => ({
    echo: new Echo({
        Pusher,
        broadcaster: 'pusher',
        key: env('VITE_PUSHER_APP_KEY'),
        cluster: env('VITE_PUSHER_APP_CLUSTER', 'mt1'),
        wsHost: env(
            'VITE_PUSHER_HOST',
            `ws-${env('VITE_PUSHER_APP_CLUSTER')}.pusher.com`,
        ),
        wsPort: env('VITE_PUSHER_PORT', '80'),
        wssPort: env('VITE_PUSHER_PORT', '443'),
        forceTLS: env('VITE_PUSHER_SCHEME', 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        encrypted: true,
        authorizer: (channel: Channel) => ({
            authorize: (socketId: any, callback: AuthorizerCallback) => {
                authBroadcastingMutation({ socketId, channel })
                    .then((response) => {
                        callback(null, response.data);
                    })
                    .catch((error) => {
                        callback(error, null);
                    });
            },
        }),
    }),

    queue: [],

    addNotify: (data) => {
        set(
            (state) => {
                state.queue.push(data);

                return state;
            },
            false,
            'addNotify',
        );
    },

    removeNotify: () => {
        set(
            (state) => {
                state.queue.shift();

                return state;
            },
            false,
            'removeNotify',
        );
    },
});

const persistOptions: PersistOptions<NotifyState> = { name: 'notify' };
const devtoolsOptions: DevtoolsOptions = { name: 'NotifyStore' };

export const notifyStore = createStore<NotifyState>()(
    devtools(persist(createNotifySlice, persistOptions), devtoolsOptions),
);

export const echo = () => notifyStore.getState().echo;
