import { defineConfig } from 'vite';
import type { UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const baseConfig: UserConfigExport = {
    plugins: [vue()],
    define: {
        'process.env': process.env
    },
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        target: 'esnext'
    },
    server: {
        open: '/'
    }
};

export default defineConfig(() => {
    return baseConfig;
});
