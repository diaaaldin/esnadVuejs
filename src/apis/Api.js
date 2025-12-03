import axios from "axios";
import { Urls } from '@/config/config.js'

const Api = axios.create({
    baseURL: `${Urls.cpSite}/api`,
    //baseURL: 'http://localhost:4000/api'
    //baseURL: 'https://cp.markabatistore.com/api'
    
});
export default Api;