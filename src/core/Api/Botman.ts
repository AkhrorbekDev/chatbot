import ApiCore from "./core/ApiCore";


export class Botman extends ApiCore {
    getMessages(data: Object) {
        return this.get(`/chat`, data)
    }

    sendMessage(data: Object) {
        return this.post(`/send-sms`, {data})
    }
}
