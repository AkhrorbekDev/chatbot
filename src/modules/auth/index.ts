import {App} from 'vue';
import {Auth} from './Auth';
import {moduleDefaults, ModuleOptions} from '@/modules/auth/types';
import defu from 'defu';

export default function createAuth(app: App, options: ModuleOptions | object) {
    const option: ModuleOptions = defu(
        options,
        moduleDefaults
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
