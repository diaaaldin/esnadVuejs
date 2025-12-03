import Income from "@/apis/Incomes";

export const GetAllIncomes = ({ commit, dispatch }, data) => {
    return Income.GetAllIncomes(data).then(function (response) {
        // API response structure: { pagination: { currentPage, pageCount, pageSize, rowCount }, data: [], sortable: {}, filterable: {} }
        const responseData = response.data.data || {};
        const incomesData = responseData.incomes || responseData;
        console.log("incomesData : ", incomesData);
        
        const paginationInfo = incomesData.pagination || {};
        const incomesList = incomesData.data || [];
        
        commit('SET_INCOMES_DATA', incomesList);
        commit('SET_INCOMES_PAGINATION', {
            data: incomesList,
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

export const CreateIncome = ({ commit, dispatch }, data) => {
    return Income.CreateIncome(data).then(function (response) {
        commit('SET_INCOME_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdateIncome = ({ commit, dispatch }, data) => {
    return Income.UpdateIncome(data).then(function (response) {
        commit('SET_INCOME_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const DeleteIncome = ({ commit, dispatch }, id) => {
    return Income.DeleteIncome(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const CreateIncomesFromExcel = ({ commit, dispatch }, file) => {
    return Income.CreateIncomesFromExcel(file).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

