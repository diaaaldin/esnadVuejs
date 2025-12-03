import Visit from "@/apis/Visit";

export const RecordVisit = ({ commit, dispatch }, data) => {
    return Visit.RecordVisit(data).then(function (response) {
        //commit('SET_RECORD_VISIT', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
