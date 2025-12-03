import Wallet from "@/apis/Wallets";

export const GetAllWallets = ({ commit, dispatch }, data) => {
    return Wallet.GetAllWallets(data).then(function (response) {
        commit('SET_WALLETS_DATA', response.data.data);
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

export const CreateWallet = ({ commit, dispatch }, data) => {
    return Wallet.CreateWallet(data).then(function (response) {
        commit('SET_WALLET_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdateWallet = ({ commit, dispatch }, data) => {
    return Wallet.UpdateWallet(data).then(function (response) {
        commit('SET_WALLET_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const DeleteWallet = ({ commit, dispatch }, id) => {
    return Wallet.DeleteWallet(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

