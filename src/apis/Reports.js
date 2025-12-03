import Api from "./Api";

const END_POINT = 'Report';

export default {

    GetGeneralReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                duration: data.duration || 0
            }
        };

        return Api.get(`${END_POINT}/GetGeneralReport`, config);
    },

    GetFundersReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                funderId: data.funderId || 0,
                projectId: data.projectId || 0
            }
        };

        return Api.get(`${END_POINT}/GetFundersReport`, config);
    },

    GetItemsReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                projectId: data.projectId || 0,
                itemId: data.itemId || 0,
                fromDate: data.fromDate || "",
                toDate: data.toDate || ""
            }
        };

        return Api.get(`${END_POINT}/GetItemsReport`, config);
    },

    GetDestinationsReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                destinationId: data.destinationId || 0,
                fromDate: data.fromDate || "",
                toDate: data.toDate || ""
            }
        };

        return Api.get(`${END_POINT}/GetDestinationsReport`, config);
    },

    GetDestinationsBenefitsReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                projectId: data.projectId || 0,
                funderId: data.funderId || 0,
                destinationId: data.destinationId || 0
            }
        };

        return Api.get(`${END_POINT}/GetDestinationsBenefitsReport`, config);
    },

    // Excel export endpoints
    ExportGeneralReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                duration: data.duration || 0,
                title: data.title || "التقرير العام"
            },
            responseType: 'blob'
        };

        return Api.get(`${END_POINT}/ExportGeneralReport`, config);
    },

    ExportFundersReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                funderId: data.funderId || 0,
                projectId: data.projectId || 0,
                title: data.title || "تقرير الممولين"
            },
            responseType: 'blob'
        };

        return Api.get(`${END_POINT}/ExportFundersReport`, config);
    },

    ExportItemsReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                projectId: data.projectId || 0,
                itemId: data.itemId || 0,
                fromDate: data.fromDate || "",
                toDate: data.toDate || "",
                title: data.title || "تقرير الأصناف"
            },
            responseType: 'blob'
        };

        return Api.get(`${END_POINT}/ExportItemsReport`, config);
    },

    ExportDestinationsReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                destinationId: data.destinationId || 0,
                fromDate: data.fromDate || "",
                toDate: data.toDate || "",
                title: data.title || "تقرير المناطق"
            },
            responseType: 'blob'
        };

        return Api.get(`${END_POINT}/ExportDestinationsReport`, config);
    },

    ExportDestinationsBenefitsReport(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                projectId: data.projectId || 0,
                funderId: data.funderId || 0,
                destinationId: data.destinationId || 0,
                title: data.title || "تقرير إستفادة المناطق"
            },
            responseType: 'blob'
        };

        return Api.get(`${END_POINT}/ExportDestinationsBenefitsReport`, config);
    },

}

