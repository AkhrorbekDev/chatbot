import ApiCore from "./core/ApiCore";


export class Botman extends ApiCore {
    getMessages(data: Object) {
        return this.get(`/botman`, data)
    }

    sendMessage(data: Object) {
        return this.post(`/botman`, data)
    }
}
