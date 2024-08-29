export interface objectTypeEndpoint {
  method: string,
  url: string
}

export type Endpoint = {
  [index: string]: objectTypeEndpoint
}
export type Strategy = {
  name: string,
  endpoints: Endpoint,
  properties: {
    fetchUser: boolean,
    token: {
      name: string,
      global: boolean,
      type: string
      property: string,
      key: string,
      maxAge: number | Date
    },
    refreshToken: {
      type: string | false
      property: string,
      key: string,
      maxAge: number | Date
    },
    user: {
      property: string,
      key: string,
    }
  }
}

export type ModuleOptions = {
  baseURL: string | undefined,
  redirect: {
    [index: string]: string | {
      [index: string]: string
    }
  },
  cookies: {
    prefix: string;
    options: {
      path: string;
      expires?: number | Date;
      maxAge?: number;
      domain?: string;
      secure?: boolean;
    }
  },
  store: {
    namespace: string
  },
  strategies: Record<number, Strategy>
  strategy: Strategy,
  setLoggedIn: boolean
}


export const moduleDefaults: ModuleOptions = {
  strategies: [],
  baseURL: undefined,
  redirect: {
    login: {name: 'home'},
    logOut: {name: 'login'}
  },
  cookies: {
    prefix: 'auth_',
    options: {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: true,
    }
  },
  store: {
    namespace: 'auth'
  },
  strategy: {
    name: 'laravelPassport',
    endpoints:
      {
        login: {
          url: '/login',
          method: 'post'
        },
        user: {
          url: '/user',
          method: 'get'
        },
        logOut: {
          url: '/user/logout',
          method: 'get'
        },
        refreshToken: {
          url: '/user/refresh-token',
          method: 'post'
        }
      },
    properties: {
      fetchUser: true,
      token: {
        name: 'Authorization',
        global: true,
        maxAge: 60 * 60 * 24 * 30,
        type: 'Bearer',
        property: 'data',
        key: 'access_token'
      },
      refreshToken: {
        type: false,
        maxAge: 60 * 60 * 24 * 30,
        property: 'data',
        key: 'refresh_token'
      },
      user: {
        property: 'data',
        key: 'user'
      }
    }
  },
  setLoggedIn: true
}


