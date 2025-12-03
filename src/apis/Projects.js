import Api from "./Api";

const END_POINT = 'Project';

export default {

    GetAllProjects(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                teamId: data.teamId || 0,
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

        return Api.get(`${END_POINT}/GetAllProjects`, config);
    },

    CreateProject(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.post(`${END_POINT}/CreateProject`, data, config);
        return responce;
    },

    UpdateProject(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.put(`${END_POINT}/UpdateProject`, data, config);
        return responce;
    },

    DeleteProject(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                id: id
            }
        };

        const responce = Api.delete(`${END_POINT}/DeleteProject`, config);
        return responce;
    },

    CreateProjectsFromExcel(file) {
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

        const responce = Api.post(`${END_POINT}/CreateProjectsFromExcel`, formData, config);
        return responce;
    },

}

