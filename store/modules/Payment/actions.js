import Payment from "@/apis/Payment";

export const GetPaymentMovements = ({ commit, dispatch }, data) => {
    return Payment.GetPaymentMovements(data).then(function (response) {
        commit('SET_PAYMENT_MOVEMENTS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
