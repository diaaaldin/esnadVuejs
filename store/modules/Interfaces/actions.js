import Interfaces from "@/apis/Interfaces";
import router from "@/router/index";
import cities from "@/config/cities.json";
import states from "@/config/states.json";

export const GetInterfaceItem = ({ commit, dispatch },id) => {
    return Interfaces.GetInterfaceItem(id).then(function (response) {
        commit('SET_INTERFACE_ITEM_DATA', response.data.data);
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
    });
}


export const GetInterfaceItems = ({ commit, dispatch } , id) => {
    return Interfaces.GetInterfaceItems(id).then(function (response) {
        console.log("response : ",response.data.data);
        commit('SET_INTERFACE_ITEMS_DATA', response.data.data);
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
    });
}


export const CreateInterfaceItem = ({ commit, dispatch },data) => {
    return Interfaces.CreateInterfaceItem(data).then(function (response) {
        commit('SET_INTERFACE_ITEM_CREATE_UPDATE_DATA', response.data.data);
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
    });
}

export const UpdateInterfaceItem = ({ commit, dispatch },data) => {
    return Interfaces.UpdateInterfaceItem(data).then(function (response) {
        commit('SET_INTERFACE_ITEM_CREATE_UPDATE_DATA', response.data.data);
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
    });
}

export const DeleteInterfaceItem = ({ commit, dispatch },id) => {
    return Interfaces.DeleteInterfaceItem(id).then(function (response) {
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
    });
}
