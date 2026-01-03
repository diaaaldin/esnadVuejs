import Api from "./Api";

const END_POINT = 'Outcome';

export default {

    GetAllOutcomes(data) {
        let config = {
            params: {
                teamId: data.teamId || 0,
                walletId: data.walletId || 0,
                fundWay: data.fundWay || 0,
                currency: data.currency || 0,
                funder: data.funder || 0,
                project: data.project || 0,
                destination: data.destination || 0,
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
            headers: { 'Authorization': token },
        };

        const responce = Api.post(`${END_POINT}/CreateOutcome`, data, config);
        return responce;
    },

    UpdateOutcome(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };

        const responce = Api.put(`${END_POINT}/UpdateOutcome`, data, config);
        return responce;
    },

    DeleteOutcome(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                id: id
            }
        };

        const responce = Api.delete(`${END_POINT}/DeleteOutcome`, config);
        return responce;
    },

    DeleteMultiOutcome(ids) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            data: ids  // Send array directly in request body
        };

        const responce = Api.delete(`${END_POINT}/DeleteMultiOutcome`, config);
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
                'Authorization': token
                ,'Content-Type': 'multipart/form-data'
            },
        };

        const responce = Api.post(`${END_POINT}/CreateOutcomesFromExcel`, formData, config);
        return responce;
    },

}

