import Api from "./Api";

const END_POINT = 'Statistics';

export default {
    HomeStatisticsInfo(teamId = 0, fromDate = null, toDate = null) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                teamId: teamId || 0,
            },
        };
        
        // Add date parameters if provided
        if (fromDate) {
            config.params.fromDate = fromDate;
        }
        if (toDate) {
            config.params.toDate = toDate;
        }
        
        return Api.get(`${END_POINT}/GetStatistics`, config);
    },
}