import {FetchOptions} from "ofetch";
export type urlObject = {
    internal: string,
    external: string,
}
// TODO: Avoid using fetch as base
interface requestOptions extends FetchOptions {
    url?: string,
    withCredentials?: boolean;

    [key: symbol]: any
}

interface responseOptions extends FetchOptions {
    data: any
}

export type HTTPRequest = requestOptions
export type HTTPResponse = responseOptions
