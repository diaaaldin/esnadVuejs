import {HubConnectionBuilder} from "@aspnet/signalr";
import { Urls } from '@/config/config.js'
class CallHub {
    constructor(){
        this.client = new HubConnectionBuilder()
        .withUrl(`${Urls.cpSite}/api/NotificationMessage`)
        .build();
    }
    async start() {
        try {
            await this.client.start();
        } catch (err) {
            console.error("SignalR connection error: ", err);
        }
    }
}
export default new CallHub();