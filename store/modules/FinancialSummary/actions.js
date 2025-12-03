import FinancialSummary from "@/apis/FinancialSummary";

export const GetFinancialSummary = ({ commit, dispatch }, data) => {
    return FinancialSummary.GetFinancialSummary(data).then(function (response) {
        // API response structure: { pagination: { currentPage, pageCount, pageSize, rowCount }, data: [], sortable: {}, filterable: {} }
        const responseData = response.data.data || {};
        const summaryData = responseData.items || responseData;
        console.log("summaryData : ", summaryData);
        
        const paginationInfo = summaryData.pagination || {};
        const summaryList = summaryData.data || [];
        
        commit('SET_FINANCIAL_SUMMARY_DATA', summaryList);
        commit('SET_FINANCIAL_SUMMARY_PAGINATION', {
            data: summaryList,
            totalItems: paginationInfo.rowCount || 0,
            totalPages: paginationInfo.pageCount || 0,
            currentPage: paginationInfo.currentPage || data.page || 1,
            pageSize: paginationInfo.pageSize || data.pageSize || 5
        });

        return response.data.data;
    }).catch(function (error) {
        if (error) {
            // Error with response
            if (error.status == 401) {
                console.log("Unauthorized");
            } else {
                console.log(error.message);
            }
        } else {
            // Network failure or unexpected error
            console.log("An error occurred. Please try again later.");
        }
        throw error;
    });
}

