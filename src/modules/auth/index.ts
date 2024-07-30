import {App} from 'vue';
import {Auth} from './Auth';
import {moduleDefaults, ModuleOptions} from '@/modules/auth/types';
import defu from 'defu';

export default async function createAuth(app: App, options: ModuleOptions | object) {
    const option: ModuleOptions = defu(
        options,
        moduleDefaults
    )
    const auth = new Auth(app, option)
    return {
        install: () => {
            auth.init()
            app.provide('$auth', auth)
            app.config.globalProperties.$auth = auth
            return auth
        }
    }
}
