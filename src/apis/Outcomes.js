import Api from "./Api";

const END_POINT = 'Outcome';

export default {

    GetAllOutcomes(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                teamId: data.teamId || 0,
                walletId: data.walletId || 0,
                fundWay: data.fundWay || 0,
                currency: data.currency || 0,
                funder: data.funder || 0,
                project: data.project || 0,
                fromDate: data.fromDate || "",
                toDate: data.toDate || "",
                page: data.page || 1,
                pageSize: data.pageSize || 5,
                sortColumn: data.sortColumn || "",
                sortDirection: data.sortDirection || "ascending",
                searchText: data.searchText || ""
            }
        };

        return Api.get(`${END_POINT}/GetAllOutcomes`, config);
    },

    CreateOutcome(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.post(`${END_POINT}/CreateOutcome`, data, config);
        return responce;
    },

    UpdateOutcome(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.put(`${END_POINT}/UpdateOutcome`, data, config);
        return responce;
    },

    DeleteOutcome(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                id: id
            }
        };

        const responce = Api.delete(`${END_POINT}/DeleteOutcome`, config);
        return responce;
    },

    CreateOutcomesFromExcel(file) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let formData = new FormData();
        formData.append('file', file);

        let config = {
            headers: { 
                'Authorization': token, 
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'multipart/form-data'
            },
        };

        const responce = Api.post(`${END_POINT}/CreateOutcomesFromExcel`, formData, config);
        return responce;
    },

}

