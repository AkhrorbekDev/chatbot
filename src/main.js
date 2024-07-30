import './assets/scss/main.scss'
import App from './App.vue'
import {vMaska} from "maska/vue"
import createAuth from "@/modules/auth";
import Storage from '@/modules/storage';

// const pinia = createPinia()
// const app = createApp(App)
// app
//     .use(pinia)
//     .use(Storage)
//
//
// const auth = await createAuth(app, {
//     baseURL: 'https://auth.olcha.uz/api',
//     redirect: false,
//     strategy: {
//         name: 'laravelPassword',
//         endpoints: {
//             login: {
//                 url: '/v2/oauth/token',
//                 method: 'post'
//             },
//             user: {
//                 url: '/v1/user/profile',
//                 method: 'get'
//             },
//             logOut: {
//                 url: '/v2/user/logout',
//                 method: 'get'
//             },
//             refreshToken: {
//                 url: '/user/refresh-token',
//                 method: 'post'
//             }
//         },
//         properties: {
//             fetchUser: false,
//             token: {
//                 name: 'Authorization',
//                 global: true,
//                 maxAge: 60 * 60 * 24 * 30,
//                 type: 'Bearer',
//                 property: '',
//                 key: 'access_token'
//             },
//             refreshToken: {
//                 type: false,
//                 maxAge: 60 * 60 * 24 * 30,
//                 property: '',
//                 key: 'refresh_token'
//             },
//             user: {
//                 property: '',
//                 key: 'user'
//             }
//         },
//
//     },
//     grantType: 'password',
//     clientId: '6',
//     clientSecret: 'RnfliHduJAdJ5bcmDOp63WDu0uMjA0ZPYvirCnHD'
// })
// app
//     .directive('maska', vMaska)
//     .use(auth).mount('#app')
export {App, Storage, createAuth, vMaska}
