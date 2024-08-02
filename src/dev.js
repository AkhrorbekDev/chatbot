import './assets/scss/main.scss'
import {createApp} from 'vue';
import App from './components/App.vue'
import {vMaska} from "maska/vue"
import createAuth from "@/modules/auth";
import Storage from '@/modules/storage';
import {createPinia} from "pinia";

const pinia = createPinia()
const ChatConnectionWidget = window.ChatConnectionWidget || {
    options: {
        rootId: 'app',
        defaultTheme: 'theme-light',
    }
}
const app = createApp(App)
app
    .use(pinia)
    .provide('widget-options', ChatConnectionWidget?.options)
    .use(Storage)


const auth = createAuth(app, {
    baseURL: 'https://auth.olcha.uz/api',
    redirect: false,
    strategy: {
        name: 'laravelPassword',
        endpoints: {
            login: {
                url: '/v2/oauth/token',
                method: 'post'
            },
            user: {
                url: '/v1/user/profile',
                method: 'get'
            },
            logOut: {
                url: '/v2/user/logout',
                method: 'get'
            },
            refreshToken: {
                url: '/user/refresh-token',
                method: 'post'
            }
        },
        properties: {
            fetchUser: false,
            token: {
                name: 'Authorization',
                global: true,
                maxAge: 60 * 60 * 24 * 30,
                type: 'Bearer',
                property: '',
                key: 'access_token'
            },
            refreshToken: {
                type: false,
                maxAge: 60 * 60 * 24 * 30,
                property: '',
                key: 'refresh_token'
            },
            user: {
                property: '',
                key: 'user'
            }
        },

    },
    cookies: {
        prefix: 'chat-bot.auth_',
    },
    grantType: 'password',
    clientId: '6',
    store: false,
    clientSecret: 'RnfliHduJAdJ5bcmDOp63WDu0uMjA0ZPYvirCnHD'
})
app
    .directive('maska', vMaska)
    .use(auth).mount(`#app`)
