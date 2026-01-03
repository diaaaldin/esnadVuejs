import Api from "./Api";

const END_POINT = 'Statistics';

export default {
    HomeStatisticsInfo(teamId = 0) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                teamId: teamId || 0,
            },
        };
        return Api.get(`${END_POINT}/GetStatistics`, config);
    },
}