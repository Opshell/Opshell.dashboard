import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config.js'; // Vite config 環境設定

import { fileURLToPath, URL } from 'node:url';

export default mergeConfig({ // Vite + Vitest config [拿Vite config 的設定來用]
    test: { // https://vitest.dev/guide/#configuring-vitest
        include: [ '__test__/*.spec.ts' ],
        // exclude: ['**/node_modules/**', '**/dist/**'],

        globals: true,
        environment: 'jsdom',
        deps: {},
    },
});