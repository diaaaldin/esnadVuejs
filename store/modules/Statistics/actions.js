import Statistic from "@/apis/Statistic";

export const HomeStatisticsInfo = ({ commit, dispatch }, teamId = 0) => {
    return Statistic.HomeStatisticsInfo(teamId).then(function (response) {
        //commit('SET_RECORD_VISIT', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
