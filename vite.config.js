import {fileURLToPath, URL} from 'node:url'

import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import externalGlobals from 'vite-plugin-external-globals';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        externalGlobals({
            vue: 'Vue',
            // Add other dependencies here if needed
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            name: 'MyLib',
            // the proper extensions will be added
            fileName: 'my-lib',
            entry: resolve(__dirname, 'src/main.js'),
        },
        // rollupOptions: {
        //     // make sure to externalize deps that shouldn't be bundled
        //     // into your library
        //     external: ['vue'],
        //     output: {
        //         // Provide global variables to use in the UMD build
        //         // for externalized deps
        //         globals: {
        //             vue: 'Vue',
        //         },
        //     },
        // },
    },
})
