import {stringify} from 'qs'
import {$fetch, $Fetch} from 'ofetch'
import {buildURL} from './helpers/buildUrl'

const getPropertyValue = (parent, child) => {
    const isInvalid = (parent !== undefined) && (parent[child] !== undefined) && (parent !== '')
    if (isInvalid) {
        return parent[child]
    }
    return ''
}
const abortControllers = new Map()

function createAbortController(url) {
    const controller = new AbortController()
    abortControllers.set(url, controller)
    return controller
}

class ApiCore {
    axios
    private fetch: $Fetch
    private readonly $_fetch: (url, options) => Promise<unknown>

    constructor(context, baseURL = 'http://92.204.254.100:5050') {
        this.fetch = $fetch.create({
            retry: 0,
            baseURL,
            timeout: 15000,
            async onRequest(ctx) {
                ctx.options.paramsSerializer = (query) => {
                    return stringify(query, {
                        arrayFormat: 'indices',
                        skipNulls: true
                    })
                }
                if (ctx.options.config) {
                    Object.keys(ctx.options.config).forEach((key) => {
                        ctx.options[key] = ctx.options.config[key]
                    })
                }
                ctx.options.headers = {
                    ...ctx.options.headers,
                    ClientModel: 'Chat'
                }
                ctx.request = buildURL(ctx.request, ctx.options.params, ctx.options.paramsSerializer).replace(/^\?/, '')
                ctx.options._params = ctx.options.params
                delete ctx.options.params
                if (context['$chatbot-auth'].interceptor) {
                    ctx.options = await context['$chatbot-auth'].interceptor({
                        ...ctx.options,
                        url: ctx.request
                    })
                }

                if (ctx.options.config?.abortable) {
                    if (typeof AbortController !== 'undefined') {
                        const url = ctx.options.config.abortableFullpath ? ctx.request : ctx.request.split('?')[0]
                        if (abortControllers.get(url) && !abortControllers.get(url).signal.aborted) {
                            abortControllers.get(url).abort('Cancel request')
                            abortControllers.delete(url)
                            ctx.options.signal = createAbortController(url).signal
                        } else {
                            ctx.options.signal = createAbortController(url).signal
                        }
                    } else {
                        console.log('AbortController is not supported by your browser')
                    }
                }
            },
            onResponse(ctx) {
                if (ctx.options.config?.abortable) {
                    const request = ctx.request.replace(ctx.options.baseURL, '')
                    const url = ctx.options.config.abortableFullpath ? request : request.split('?')[0]
                    abortControllers.delete(url)
                }
            }
        })
        this.$_fetch = (url, options) => {
            return new Promise((resolve, reject) => {
                this.fetch(url, {
                    ...options,
                    onResponseError({
                                        response,
                                        options
                                    }) {
                        const message = getPropertyValue(response._data, 'message')
                        const statusText = getPropertyValue(response, 'statusText')
                        const statusCode = getPropertyValue(response, 'status')
                        const sendingMessage = message !== '' ? message : statusText
                        return reject({
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
                        const message = ctx.error?.message || context.$i18n.t('default_error')
                        return reject({
                            statusCode: 511,
                            data: ctx.error,
                            message,
                            status: 511,
                            ctx,
                            is: 'plugins request error',
                            fatal: true
                        })
                    }
                }).then((res) => {
                    return resolve(res)
                })
            })
        }
    }

    get(url, data = {}, config = null) {
        return this.$_fetch(url, {
            method: 'get',
            ...data,
            config
        })
    }

    post(url, data, config = null) {
        return this.$_fetch(url, {
            body: data.data,
            method: 'post',
            ...data,
            config
        })
    }

    put(url, data, config = null) {
        return this.$_fetch(url, {
            body: data.data,
            method: 'put',
            config
        })
    }

    delete(url, data, config = null) {
        // console.log(url, 'this.delete')
        return this.$_fetch(url, {
            body: data.data,
            method: 'delete',
            config
        })
    }

    config(arg = {}) {
        Object.keys(arg).forEach((key) => {
            this.axios.setHeader(key, arg[key])
        })
        return this
    }
}

export default ApiCore
