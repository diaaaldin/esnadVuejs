import Api from "./Api";

const END_POINT = 'Visit';

export default {
    RecordVisit(data) {
        return Api.post(`${END_POINT}/RecordVisit`, data);
    },
}