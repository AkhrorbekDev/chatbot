import './assets/scss/main.scss'
import {createApp, ref} from 'vue';
import App from './components/App.vue'
import {vMaska} from "maska/vue"
import createAuth from "@/modules/auth";
import Storage from '@/modules/storage';

const ChatConnectionWidget = window.ChatConnectionWidget || {
    options: {
        rootId: 'app',
        defaultTheme: 'theme-light',
    }
}
const app = createApp(App, {class: ChatConnectionWidget.options.defaultTheme})
const alertOptions = ref({
    color: 'info',
    text: '',
    'open': false,
    events: {
        openModal: (statusColor, msg) => {
            let openTimeout
            let closeTimeout

            if (openTimeout) {
                clearTimeout(openTimeout)
            }
            if (closeTimeout) {
                clearTimeout(closeTimeout)
            }

            openTimeout = setTimeout(() => {
                alertOptions.value['open'] = true
                alertOptions.value.color = statusColor
                alertOptions.value.text = msg
            }, 0)

            closeTimeout = setTimeout(() => {
                alertOptions.value['open'] = false
            }, 2000)
        },
        closeModal: () => {
            alertOptions.value['open'] = false
        },
    },
})
app.provide('alertOptions', alertOptions)
app
    .provide('widget-options', ChatConnectionWidget.options)
    .use(Storage)


const auth = createAuth(app, {
    baseURL: 'https://auth.olcha.uz/test/api',
    redirect: false,
    strategy: {
        name: 'laravelPassport',
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
                key: 'access_token',
                property: '',
                prefix: 'access_token',
                expirationPrefix: 'access_token_expiration'

            },
            refreshToken: {
                type: false,
                maxAge: 60 * 60 * 24 * 30,
                key: 'refresh_token',
                property: '',
                prefix: 'refresh_token_v2',
                expirationPrefix: 'refresh_token_v2_expiration'

            },
            user: {
                property: '',
                key: 'user'
            }
        },
    },
    cookies: {
        prefix: 'auth.',
    },
    grantType: 'password',
    clientId: '6',
    store: false,
    clientSecret: 'RnfliHduJAdJ5bcmDOp63WDu0uMjA0ZPYvirCnHD'
})

app
    .directive('maska', vMaska)
    .use(auth).mount(`#${ChatConnectionWidget.options.rootId}`)
