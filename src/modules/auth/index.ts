import {App} from 'vue';
import {Auth} from './Auth';
import {moduleDefaults, ModuleOptions} from '@/modules/auth/types';
import defu from 'defu';

export default function createAuth(app: App, options: ModuleOptions | object) {
    const defaults = defu(moduleDefaults, {
        baseURL: 'https://example.com',
        redirect: false,
        strategy: {
            name: 'laravelPassport',
            endpoints: {
                login: {
                    url: '/_auth/laravelPassport/token',
                    method: 'post'
                },
                user: {
                    url: '/v1/user/profile',
                    method: 'get',
                    baseURL: 'https://auth.olcha.uz/test/api'
                },
                logOut: {
                    url: '/v2/user/logout',
                    method: 'get',
                    baseURL: 'https://auth.olcha.uz/test/api'
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
        clientSecret: ''
    })
    const option: ModuleOptions = defu(
        options,
        defaults,

    )
    const auth = new Auth(app, option)
    return {
        install: () => {
            auth.init()
            app.provide('$chatbot-auth', auth)
            app.config.globalProperties['$chatbot-auth'] = auth
            return auth
        }
    }
}
