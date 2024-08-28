import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'), // Remove process.env
        'process': '{}', // Fallback for any other process references
    },
    build: {
        target: '',
        lib: {
            entry: './src/main.js',
            name: 'ChatWidget',
            formats: ['es', 'iife'],
            fileName: (format, name) => `chat-widget.${name}.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
                inlineDynamicImports: true, //
            }
        }
    },
})
