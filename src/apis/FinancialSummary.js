import Api from "./Api";

const END_POINT = 'Wallet';

export default {

    GetFinancialSummary(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                teamId: data.teamId || 0,
                walletId: data.walletId !== undefined && data.walletId !== null ? data.walletId.toString() : "",
                type: data.type || 0,
                fromDate: data.fromDate || "",
                toDate: data.toDate || "",
                page: data.page || 1,
                pageSize: data.pageSize || 5,
                sortColumn: data.sortColumn || "",
                sortDirection: data.sortDirection || "ascending",
                searchText: data.searchText || ""
            }
        };

        return Api.get(`${END_POINT}/GetFinancialSummary`, config);
    },

}

