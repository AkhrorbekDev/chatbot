import ApiCore from "./core/ApiCore";


export class Authorization extends ApiCore {
    constructor(options) {
        super(options, 'https://auth.olcha.uz/api/v1');
    }

    checkUser(phone: string) {
        return this.get(`/user/exists/${phone}`)
    }
    sendSms(data: object) {
        return this.post(`sendsms2`, {data})
    }
    loginWithSms(data: object) {
        return this.post(`login-with-sms`, {data})
    }
    registerWithSms(data: object) {
        return this.post(`register-with-sms`, {data})
    }
}
