import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}

const env = (key: string, defaultValue: string = ''): string => {
    if (Object.hasOwn(import.meta.env, key) && import.meta.env[key]) {
        return import.meta.env[key];
    }

    return defaultValue;
};

window.Pusher = Pusher;

window.Echo = new Echo({
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
});
