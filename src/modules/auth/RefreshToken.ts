import {Strategy} from '@/modules/auth/types';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {Storage} from '@/modules/auth/Storage';
import {TokenStatus} from '@/modules/auth/TokenStatus';

interface jwtPayload extends JwtPayload {
}

export type jwtPayloadImpl = jwtPayload & {
    aud: string[] | string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    sub: string;
}

export class RefreshToken {
    public strategy: Strategy
    public $storage: Storage

    constructor(strategy: Strategy, storage: Storage) {
        this.strategy = strategy
        this.$storage = storage
    }

    // @ts-ignore
    async status(): Promise<TokenStatus> | TokenStatus {
        const [token, expiration] = await Promise.all([this.get(), this._getExpiration()])
        return new TokenStatus(token, Number(expiration))
    }

    get(): string | boolean {
        const _key = this._getTokenKey()
        return this.$storage.getUniversal(_key) as string | boolean
    }

    set(tokenValue: string): any {
        const token = addTokenPrefix(tokenValue, this.strategy.properties.refreshToken.type)
        return this._setToken(token)
    }

    remove() {
        const _key = this.strategy.properties.refreshToken.key + this.strategy.name
        this._setExpiration(false)
        return this.$storage.removeUniversal(_key)
    }

    _updateExpiration(token: string | boolean): any {
        let tokenExpiration
        const _tokenIssuedAtMillis = Date.now()
        const _tokenTTLMillis = Number(this.strategy.properties.refreshToken.maxAge) * 1000
        const _tokenExpiresAtMillis = _tokenTTLMillis
            ? _tokenIssuedAtMillis + _tokenTTLMillis
            : 0

        try {
            tokenExpiration =
                jwtDecode<jwtPayloadImpl>(token + '').exp * 1000 || _tokenExpiresAtMillis
        } catch (error) {
            // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
            tokenExpiration = _tokenExpiresAtMillis
        }

        // Set token expiration
        return this._setExpiration(tokenExpiration || false)
    }

    async check() {
        const result = {
            isValid: false,
            expired: false,
        }
        const token = this.get()
        if (!token) {
            return result
        }
        const tokenStatus = await this.status()

        result.expired = tokenStatus.expired()
        result.isValid = tokenStatus.valid()
        return result
    }

    private _setToken(token: string) {
        const _key = this._getTokenKey()
        return this.$storage.setUniversal(_key, token)
    }

    private _setExpiration(expiration: number | false | string) {
        const _key = this._getExpirationKey()
        return this.$storage.setUniversal(_key, expiration)
    }

    private _getExpiration() {
        const _key = this._getExpirationKey()
        // @ts-ignore
        return this.$storage.getUniversal(_key)
    }


    private _getTokenKey() {
        return this.strategy.properties.refreshToken.prefix + '.' + this.strategy.name
    }

    private _getExpirationKey() {
        return this.strategy.properties.refreshToken.expirationPrefix + '.' + this.strategy.name
    }


}

export function addTokenPrefix(
    token: string,
    tokenType: string | false
): string {
    if (
        !token ||
        !tokenType ||
        token.startsWith(tokenType)
    ) {
        return token
    }

    return tokenType + ' ' + token
}
