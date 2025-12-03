import Api from "./Api";

const END_POINT = 'Wallet';

export default {

    GetAllWallets(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                teamId: data.teamId || 0,
                name: data.name || "",
                fundWays: data.fundWays || 0
            }
        };

        return Api.get(`${END_POINT}/GetAllWallets`, config);
    },

    CreateWallet(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.post(`${END_POINT}/CreateWallet`, data, config);
        return responce;
    },

    UpdateWallet(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.put(`${END_POINT}/UpdateWallet`, data, config);
        return responce;
    },

    DeleteWallet(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                id: id
            }
        };

        const responce = Api.delete(`${END_POINT}/DeleteWallet`, config);
        return responce;
    },

}

