import ApiCore from "./core/ApiCore";


export class Botman extends ApiCore {
    getMessages(data: Object) {
        return this.get(`/api/v1/chat`, data)
    }

    sendMessage(data: Object) {
        return this.post(`/api/v1/send-sms`, {data})
    }
    mergeHistory(data: Object) {
        return this.post(`/api/v1/merge-history`, {data})
    }
}
