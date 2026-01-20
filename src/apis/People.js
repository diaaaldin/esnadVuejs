import Api from "./Api";

const END_POINT = 'People';

export default {

    GetAllPeople(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                name: data.name || "",
                ssn: data.ssn || "",
                projectId: data.projectId || 0,
                exceptionPeriod: data.exceptionPeriod || 0,
                page: data.page || 1,
                pageSize: data.pageSize || 5,
                sortColumn: data.sortColumn || "",
                sortDirection: data.sortDirection || "ascending",
                searchText: data.searchText || ""
            }
        };

        return Api.get(`${END_POINT}/GetAllPeople`, config);
    },

    CreatePeople(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };

        const responce = Api.post(`${END_POINT}/CreatePeople`, data, config);
        return responce;
    },

    UpdatePeople(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };

        const responce = Api.put(`${END_POINT}/UpdatePeople`, data, config);
        return responce;
    },

    DeletePeople(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                id: id
            }
        };

        const responce = Api.delete(`${END_POINT}/DeletePeople`, config);
        return responce;
    },

    DeleteMultiPeople(ids) {
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

        const responce = Api.delete(`${END_POINT}/DeleteMultiPeople`, config);
        return responce;
    },

    CreatePeopleFromExcel(file, projectId, exceptionPeriod) {
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
            params: {
                projectId: projectId || 0,
                exceptionPeriod: exceptionPeriod || 0
            },
            responseType: 'blob' // Required to handle both JSON and file downloads
        };

        const responce = Api.post(`${END_POINT}/CreatePeopleFromExcel`, formData, config);
        return responce;
    },

}

