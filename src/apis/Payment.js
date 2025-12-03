import Api from "./Api";

const END_POINT = 'Payment';

export default {
    GetPaymentMovements(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                dateFrom: data.dateFrom,
                dateTo: data.dateTo,
            },
        };

        return Api.get(`${END_POINT}/GetPaymentMovements`, config);
    },

}