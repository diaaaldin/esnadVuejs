import Api from "./Api";

const END_POINT = 'Code';

export default {

    GetCode(id) {
        let config = {
            params: {
                id: id
            }
        };

        return Api.get(`${END_POINT}/GetCode`, config);
    },

    GetAllCodes() {
        return Api.get(`${END_POINT}/GetAllCodes`);
    },

    GetCodesByParent(parent1, parent2 = 0) {
        let config = {
            params: {
                parent1: parent1,
                parent2: parent2
            }
        };

        return Api.get(`${END_POINT}/GetCodesByParent`, config);
    },

    GetCodesByParentWithChild(parent1, parent2 = 0) {
        let config = {
            params: {
                parent1: parent1,
                parent2: parent2
            }
        };

        return Api.get(`${END_POINT}/GetCodesByParentWithChild`, config);
    },

    CreateCode(data) {
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.post(`${END_POINT}/CreateCode`, data, config);
        return responce;
    },

    UpdateCode(data) {
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.put(`${END_POINT}/UpdateCode`, data, config);
        return responce;
    },

    CreateCodeWithChild(data) {
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.post(`${END_POINT}/CreateCodeWithChild`, data, config);
        return responce;
    },

    UpdateCodeWithChild(data) {
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.put(`${END_POINT}/UpdateCodeWithChild`, data, config);
        return responce;
    },

    DeleteCode(id) {
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                id: id
            }
        };

        const responce = Api.delete(`${END_POINT}/DeleteCode`, config);
        return responce;
    },

}

