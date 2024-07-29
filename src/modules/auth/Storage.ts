import {ModuleOptions} from '@/modules/auth/types';
import {App} from 'vue';
import Storage from '@/modules/storage/Storage'
import {defineStore, PiniaPluginContext} from 'pinia';

export type InitialState = {
    user: null
    loggedIn: boolean
}
declare type expireTimes = string | number | Date;
export const isUnset = (o: unknown): boolean =>
    typeof o === 'undefined' || o === null
export const isSet = (o: unknown): boolean => !isUnset(o)

declare interface _CookieBase {
    expire?: expireTimes;
    path?: string;
    domain?: string;
    secure?: string;
    sameSite?: string;
}

class _Storage extends Storage {
    public options: ModuleOptions
    public initialState: InitialState
    public state: any
    public app: App
    private _state: any
    // @ts-ignore
    private _useStore: boolean

    constructor(app: App, options: ModuleOptions, initialState: InitialState) {
        super()
        this.app = app
        this.options = options
        this.initialState = initialState
        this._initState()
    }

    _initState(): void {
        // Private state is suitable to keep information not being exposed to Vuex store
        // This helps prevent stealing token from SSR response HTML
        // Use vuex for local state's if possible
        this._useStore = this.options.store && !!this.app.config.globalProperties.$pinia

        if (this._useStore) {
            const authStore = defineStore({
                id: this.options.store.namespace,
                state: () => this.initialState,
                actions: {
                    SET(payload: { key: string, value: any }) {
                        console.log(payload.key, payload.value)
                        // @ts-ignore
                        this[payload.key] = payload.value
                    }
                }
            })

            this.app.config.globalProperties.$pinia.use(({store}: { store: PiniaPluginContext['store'] }) => {
                store[this.options.store.namespace] = authStore()
            })

            this.state = authStore()
        } else {
            // eslint-disable-next-line no-console
            console.warn(
                '[AUTH] The Vuex Store is not activated. This might cause issues in auth module behavior, like redirects not working properly.' +
                'To activate it, see https://nuxtjs.org/docs/2.x/directory-structure/store'
            )
        }
    }

    setCookie(key: string, value: string | boolean, options?: _CookieBase) {
        // @ts-ignore
        return this.set({key, value, options})
    }

    getCookie(key: string) {
        return this.get({key})
    }

    removeCookie(key: string, options?: object) {
        return this.remove({key, options})
    }

    setState<V extends unknown>(key: string, value: V): V {
        if (this._useStore) {
            this.state.SET({
                key,
                value
            })
        } else if (key === 'loggedIn') {
            if (!this.options.setLoggedIn) {
                this.state.SET({
                    key,
                    value: this.options.setLoggedIn
                })
            } else {
                this.state.SET({
                    key,
                    value: value
                })
            }
        }
        return value
    }

    getState(key: string): unknown {
        if (key[0] !== '_') {
            return this.state[key]
        } else {
            return this._state[key]
        }
    }

    removeState(key: string): void {
        this.setState(key, undefined)
    }

    async syncUniversal(key: string, defaultValue?: unknown): Promise<any> {
        let value = await this.getUniversal(key)
        if (isUnset(value) && isSet(defaultValue)) {
            value = defaultValue
        }

        if (isSet(value)) {
            await this.setUniversal(key, value)
        }

        return value
    }

    setUniversal(key: string, value: any): Promise<any | boolean> | Promise<void> | string | boolean {
        // Unset null, undefined
        if (isUnset(value)) {
            return this.removeUniversal(key)
        }
        return this.setCookie(key, value)
    }

    getUniversal(key: string): unknown {
        return this.getCookie(key)
    }

    removeUniversal(key: string): Promise<void> {
        return this.removeCookie(key)
    }
}

export {_Storage as Storage}
