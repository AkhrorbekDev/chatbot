import {ModuleOptions} from '@/modules/auth/types';
import {Storage} from '@/modules/auth/Storage';
import {App} from 'vue';
import {Token} from '@/modules/auth/Token';
import {RefreshToken} from '@/modules/auth/RefreshToken';
import {HTTPRequest} from '@/modules/auth/types/request';
import {$fetch, createFetch, Fetch} from "ofetch";

const getPropertyValue = (parent, child) => {
    const isInvalid = (parent !== undefined) && (parent[child] !== undefined) && (parent !== '')
    if (isInvalid) {
        return parent[child]
    }
    return ''
}

export class Auth {
    public options: ModuleOptions
    public $storage: Storage
    public $token: Token
    public $refreshToken: RefreshToken
    public app: App
    private _fetch: Fetch
    public state: any
    public interceptor
    // @ts-ignore
    public _loggedIn: boolean | string

    constructor(app: App, options: ModuleOptions) {
        console.log(options)
        this.app = app
        this.options = options
        this.interceptor = null
        this.loggedIn = false
        const initialState = {user: null, loggedIn: false}
        this.$storage = new Storage(app, options, initialState)
        this.state = this.$storage.state
        this.$token = new Token(this.options.strategy, this.$storage)
        this.$refreshToken = new RefreshToken(this.options.strategy, this.$storage)
        if (options.baseURL === undefined) {
            throw Error('base url is required option')
        }

        this._fetch = $fetch.create({
            retry: 0,
            timeout: 15000,
            baseURL: options.baseURL,
            async onRequest(ctx) {
                if (ctx.options.config) {
                    Object.keys(ctx.options.config).forEach((key) => {
                        ctx.options[key] = ctx.options.config[key]
                    })
                }
                ctx.options.headers = {
                    ...ctx.options.headers,
                    ClientModel: 'Chat'
                }
                delete ctx.options.params
            },
            onResponseError({
                                response,
                                options
                            }) {
                const message = getPropertyValue(response._data, 'message')
                const statusText = getPropertyValue(response, 'statusText')
                const statusCode = getPropertyValue(response, 'status')
                const sendingMessage = message !== '' ? message : statusText
                return Promise.reject({
                    data: response._data,
                    message: sendingMessage,
                    statusText: sendingMessage,
                    statusCode,
                    status: statusCode,
                    is: 'plugins',
                    fatal: true
                })
            },
            onRequestError(ctx) {
                const message = ctx.error?.message || 'Что то не так пожалуйста позвоните call-center или перезагрузите страницу'
                return Promise.reject({
                    statusCode: 511,
                    data: ctx.error,
                    message,
                    status: 511,
                    ctx,
                    is: 'plugins request error',
                    fatal: true
                })
            }
        })
    }

    set loggedIn(val) {
        this._loggedIn = `${val}`
    }

    get loggedIn() {
        return this._loggedIn === 'true'
    }

    init() {
        this.$storage.syncUniversal('strategy', this.options.strategy.name)
        return this.mounted()
    }

    async mounted() {
        this.setInterceptor()
        this.loggedIn = await this.getloggedIn()
        if (this.loggedIn) {
            this.$storage.setState('loggedIn', true)
        }
        const statuses = await this.check()
        if (!statuses.valid) {
            this.reset()
            // return this.app.config.globalProperties.$router.push(this.options.redirect.logOut)
            return Promise.resolve()
        }

        await this.setloggedIn(true)

        if (this.options.strategy.properties.fetchUser) {
            return await this.fetchUser()
        }
        return Promise.resolve()
    }

    getloggedIn(): Promise<boolean> {
        return this.$storage.getCookie('loggedIn')
    }

    onRedirect(redirect: true) {
        const $this = this
        if (!redirect) {
            // @ts-ignore
            $this.options.redirect = false
        }
        return $this
    }

    get user() {
        return this.$storage.getState('user')
    }

    login(endpoint: object, reset: false, callback: Function | null = null) {
        if (!this.options.strategy.endpoints.login) {
            return
        }

        // Ditch any leftover local tokens before attempting to log in
        if (reset) {
            this.reset()
        }

        // Add client id to payload if defined
        if (this.options.clientId) {
            endpoint.body['client_id'] = this.options.clientId
        }

        // Add grant type to payload if defined
        if (this.options.grantType) {
            endpoint.body['grant_type'] = this.options.grantType
        }
        // Add grant type to payload if defined
        if (this.options.clientSecret) {
            endpoint.body['client_secret'] = this.options.clientSecret
        }

        // Add scope to payload if defined
        if (this.options.scope) {
            endpoint.body['scope'] = this.options.scope
        }

        if (endpoint.baseURL === '' || !endpoint.baseURL) {
            endpoint.baseURL = this.options.baseURL
        }
        return this.request(endpoint, this.options.strategy.endpoints.login).then(
            async (res: any) => {
                const token = this._getTokenFromResponse(res)
                const refreshToken = await this._getRefreshTokenFromResponse(res)
                await Promise.all([
                    this.$token.set(token),
                    this.$token._updateExpiration(token),
                    this.$refreshToken.set(refreshToken),
                    this.$refreshToken._updateExpiration(refreshToken),
                ])
                await this.setInterceptor()
                await this.setloggedIn(true)

                if (this.options.strategy.properties.fetchUser) {
                    await this.fetchUser()
                }
                if (this.options.redirect) {
                    this.app.config.globalProperties.$router.push(this.options.redirect.login)
                }
                if (typeof callback === 'function') {
                    callback()
                }
                return Promise.resolve(res)
            }).catch((err) => {
            return Promise.reject(err)
        })
    }

    async fetchUser() {
        return await this.request(this.options.strategy.endpoints.user)
            .then(async (res) => {
                await this.setUser(this._getUserDataFromResponse(res))
                return Promise.resolve(res)
            }).catch((err) => {
                return Promise.reject(err)
            })
    }

    logOut() {
        if (this.options.strategy.endpoints.logOut) {
            return this.request(this.options.strategy.endpoints.logOut).then((res) => {
                this.reset()
                if (this.options.redirect) {
                    this.app.config.globalProperties.$router.push(this.options.redirect.logOut)
                }
                return Promise.resolve(res)
            }).catch((err) => {
                return Promise.reject(err)
            })
        }
    }

    setloggedIn(value: boolean) {
        if (!this.options.setLoggedIn) {
            this.returnThrow('Logged in is not enabled')
        }
        this.loggedIn = value
        this.$storage.setState('loggedIn', value)
        // @ts-ignore
        return this.$storage.setCookie('loggedIn', value, {in: 'this.setloggedIn()'})
    }

    returnThrow(message: string) {
        return Error(message)
    }

    async check() {
        const response = {
            valid: false,
            tokenExpired: false,
            refreshToken: false,
            refreshTokenExpired: false
        }
        const [tokenStatus, refreshToken] = await Promise.all([
            this.$token.status(),
            this.$refreshToken.status()
        ])
        response.valid = tokenStatus.valid()
        response.tokenExpired = tokenStatus.expired()
        response.refreshToken = refreshToken.valid()
        response.tokenExpired = refreshToken.expired()
        return response
    }

    async setUser(user: unknown): Promise<void> {
        this.$storage.setState('user', user)

        let check = {valid: Boolean(user)}

        // If user is defined, perform scheme checks.
        if (check.valid) {
            check = await this.check()
        }

        // Update `loggedIn` state
        this.$storage.setState('loggedIn', check.valid)
        return this.$storage.setCookie('loggedIn', check.valid)
    }

    async setInterceptor(refreshEndpoint?: string) {
        this.interceptor = async (config) => {
            // Don't intercept refresh token requests
            if (!this._needToken(config) || config.url === refreshEndpoint) {
                return config
            }

            // Perform scheme checks.
            const {
                valid,
                tokenExpired,
                refreshTokenExpired,
            } = await this.check()
            const isValid = valid

            // Refresh token has expired. There is no way to refresh. Force reset.
            if (refreshTokenExpired) {
                await this.reset()
            }

            // Token has expired.
            if (tokenExpired) {
                // Refresh token is not available. Force reset.
                await this.reset()
            }

            // Sync token
            const token = await this.$token.get()
            // Scheme checks were performed, but returned that is not valid.
            if (!isValid) {
                if (this.options.redirect) {
                    this.app.config.globalProperties.$router.push(this.options.redirect.logOut)
                }
                return config
            }

            // Token is valid, let the request pass
            // Fetch updated token and add to current request
            return Promise.resolve(this._getUpdatedRequestConfig(config, token))
        }
        return this.interceptor
    }

    reset(): void {
        // Eject request interceptor
        if (this.interceptor != null) {
            this.interceptor = null
        }
        this.$token.remove()
        this.$refreshToken.remove()
        this.setloggedIn(false)
        this.$storage.removeState('user')
        this.$storage.removeState('loggedIn')
    }

    async request(endpoint: any, defaults?: object) {
        let _endpoint =
            typeof defaults === 'object'
                ? Object.assign({}, defaults, endpoint)
                : endpoint
        if (!_endpoint.headers) {
            _endpoint.headers = {}
        }
        if (this.interceptor) {
            _endpoint = await this.interceptor(_endpoint)
        }
        return this._fetch(_endpoint.url, _endpoint).then((res) => {
            return Promise.resolve(res)
        }).catch((err) => {
            return Promise.reject(err)
        })
    }

    private _needToken(config: any): boolean {
        const options = this.options
        // @ts-ignore
        return (
            options.strategy.properties.token.global ||
            Object.values(options.strategy.endpoints).some((endpoint: HTTPRequest | string) =>
                typeof endpoint === 'object'
                    ? endpoint.url === config.url
                    : endpoint === config.url
            )
        )
    }

    private _getUpdatedRequestConfig(config: any, token: string | boolean) {
        if (typeof token === 'string') {
            config.headers[this.options.strategy.properties.token.name] = token
        }

        return config
    }

    private _getTokenFromResponse(res: any) {
        return this.options.strategy.properties.token.property ?
            res.data[this.options.strategy.properties.token.property][this.options.strategy.properties.token.key] :
            res.data[this.options.strategy.properties.token.key]

    }

    private _getRefreshTokenFromResponse(res: any) {
        return this.options.strategy.properties.refreshToken.property ?
            res.data[this.options.strategy.properties.refreshToken.property][this.options.strategy.properties.refreshToken.key] :
            res.data[this.options.strategy.properties.refreshToken.key]
    }

    private _getUserDataFromResponse(res: any) {
        return this.options.strategy.properties.user.property ? res.data[this.options.strategy.properties.user.property][this.options.strategy.properties.user.key] : res.data[this.options.strategy.properties.user.key]
    }
}

