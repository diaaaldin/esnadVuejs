import Reports from "@/apis/Reports";

export const GetGeneralReport = ({ commit }, data) => {
    return Reports.GetGeneralReport(data).then(function (response) {
        const responseData = response.data.data || [];
        commit('SET_GENERAL_REPORT_DATA', responseData);
        return responseData;
    }).catch(function (error) {
        if (error) {
            if (error.status == 401) {
                console.log("Unauthorized");
            } else {
                console.log(error.message);
            }
        } else {
            console.log("An error occurred. Please try again later.");
        }
        throw error;
    });
}

export const GetFundersReport = ({ commit }, data) => {
    return Reports.GetFundersReport(data).then(function (response) {
        const responseData = response.data.data || [];
        commit('SET_FUNDERS_REPORT_DATA', responseData);
        return responseData;
    }).catch(function (error) {
        if (error) {
            if (error.status == 401) {
                console.log("Unauthorized");
            } else {
                console.log(error.message);
            }
        } else {
            console.log("An error occurred. Please try again later.");
        }
        throw error;
    });
}

export const GetItemsReport = ({ commit }, data) => {
    return Reports.GetItemsReport(data).then(function (response) {
        const responseData = response.data.data || [];
        commit('SET_ITEMS_REPORT_DATA', responseData);
        return responseData;
    }).catch(function (error) {
        if (error) {
            if (error.status == 401) {
                console.log("Unauthorized");
            } else {
                console.log(error.message);
            }
        } else {
            console.log("An error occurred. Please try again later.");
        }
        throw error;
    });
}

export const GetDestinationsReport = ({ commit }, data) => {
    return Reports.GetDestinationsReport(data).then(function (response) {
        const responseData = response.data.data || [];
        commit('SET_DESTINATIONS_REPORT_DATA', responseData);
        return responseData;
    }).catch(function (error) {
        if (error) {
            if (error.status == 401) {
                console.log("Unauthorized");
            } else {
                console.log(error.message);
            }
        } else {
            console.log("An error occurred. Please try again later.");
        }
        throw error;
    });
}

export const GetDestinationsBenefitsReport = ({ commit }, data) => {
    return Reports.GetDestinationsBenefitsReport(data).then(function (response) {
        const responseData = response.data.data || [];
        commit('SET_DESTINATIONS_BENEFITS_REPORT_DATA', responseData);
        return responseData;
    }).catch(function (error) {
        if (error) {
            if (error.status == 401) {
                console.log("Unauthorized");
            } else {
                console.log(error.message);
            }
        } else {
            console.log("An error occurred. Please try again later.");
        }
        throw error;
    });
}

