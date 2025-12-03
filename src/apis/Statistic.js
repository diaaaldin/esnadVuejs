import Api from "./Api";

const END_POINT = 'Statistics';

export default {
    HomeStatisticsInfo(teamId = 0) {
        return Api.get(`${END_POINT}/GetStatistics`, { params: { teamId } });
    },
}