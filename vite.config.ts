/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import unfonts from 'unplugin-fonts/vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    ...(mode !== 'test' && {
        plugins: [
            laravel({
                input: ['resources/fsd-ts/src/app/index.ts'],
                refresh: true,
            }),
            react(),
            eslint(),
            checker({ typescript: true }),
            unfonts({
                google: {
                    families: [
                        { name: 'Titillium+Web', styles: 'wght@700' },
                        { name: 'Source+Serif+Pro', styles: 'wght@400;700' },
                        { name: 'Merriweather+Sans', styles: 'wght@400;700' },
                        {
                            name: 'Source+Sans+Pro',
                            styles: 'ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700',
                        },
                    ],
                },
            }),
        ],
    }),
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'resources/fsd-ts/src/shared/lib/test/setup.ts',
        include: ['**/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        coverage: {
            provider: 'v8',
            exclude: ['resources/fsd-ts/src/shared/api/**'],
        },
    },
    server: { host: false },
    preview: { open: true },
    resolve: {
        alias: {
            '~app': path.resolve('resources/fsd-ts/src/app'),
            '~entities': path.resolve('resources/fsd-ts/src/entities'),
            '~features': path.resolve('resources/fsd-ts/src/features'),
            '~pages': path.resolve('resources/fsd-ts/src/pages'),
            '~shared': path.resolve('resources/fsd-ts/src/shared'),
            '~widgets': path.resolve('resources/fsd-ts/src/widgets'),
        },
    },
}));
