import Outcome from "@/apis/Outcomes";
            
export const GetAllOutcomes = ({ commit, dispatch }, data) => {
    return Outcome.GetAllOutcomes(data).then(function (response) {
        // API response structure: { pagination: { currentPage, pageCount, pageSize, rowCount }, data: [], sortable: {}, filterable: {} }
        const responseData = response.data.data || {};
        const outcomesData = responseData.outcomes || responseData;
        console.log("outcomesData : ", outcomesData);
        
        const paginationInfo = outcomesData.pagination || {};
        const outcomesList = outcomesData.data || [];
        
        commit('SET_OUTCOMES_DATA', outcomesList);
        commit('SET_OUTCOMES_PAGINATION', {
            data: outcomesList,
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

export const CreateOutcome = ({ commit, dispatch }, data) => {
    return Outcome.CreateOutcome(data).then(function (response) {
        commit('SET_OUTCOME_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdateOutcome = ({ commit, dispatch }, data) => {
    return Outcome.UpdateOutcome(data).then(function (response) {
        commit('SET_OUTCOME_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const DeleteOutcome = ({ commit, dispatch }, id) => {
    return Outcome.DeleteOutcome(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const CreateOutcomesFromExcel = ({ commit, dispatch }, file) => {
    return Outcome.CreateOutcomesFromExcel(file).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

