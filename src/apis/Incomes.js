import Api from "./Api";

const END_POINT = 'Income';

export default {

    GetAllIncomes(data) {

        let config = {
            params: {
                teamId: data.teamId || 0,
                walletId: data.walletId || 0,
                fundWay: data.fundWay || 0,
                currency: data.currency || 0,
                funder: data.funder || 0,
                fromDate: data.fromDate || "",
                toDate: data.toDate || "",
                page: data.page || 1,
                pageSize: data.pageSize || 5,
                sortColumn: data.sortColumn || "",
                sortDirection: data.sortDirection || "ascending",
                searchText: data.searchText || ""
            }
        };

        return Api.get(`${END_POINT}/GetAllIncomes`, config);
    },

    CreateIncome(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };

        const responce = Api.post(`${END_POINT}/CreateIncome`, data, config);
        return responce;
    },

    UpdateIncome(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };

        const responce = Api.put(`${END_POINT}/UpdateIncome`, data, config);
        return responce;
    },

    DeleteIncome(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                id: id
            }
        };

        const responce = Api.delete(`${END_POINT}/DeleteIncome`, config);
        return responce;
    },

    CreateIncomesFromExcel(file) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let formData = new FormData();
        formData.append('file', file);

        let config = {
            headers: { 
                'Authorization': token
                ,'Content-Type': 'multipart/form-data'
            },
        };

        const responce = Api.post(`${END_POINT}/CreateIncomesFromExcel`, formData, config);
        return responce;
    },

}

