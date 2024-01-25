import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/ts/main.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, './resources/ts/assets'),
            '@components': path.resolve(__dirname, './resources/ts/components'),
            '@configs': path.resolve(__dirname, './resources/ts/configs'),
            '@contexts': path.resolve(__dirname, './resources/ts/contexts'),
            '@interfaces': path.resolve(__dirname, './resources/ts/interfaces'),
            '@pages': path.resolve(__dirname, './resources/ts/pages'),
            '@services': path.resolve(__dirname, './resources/ts/services'),
            '@stores': path.resolve(__dirname, './resources/ts/stores'),
            '@hooks': path.resolve(__dirname, './resources/ts/hooks'),
            '@utils': path.resolve(__dirname, './resources/ts/utils'),
        },
    },
});
