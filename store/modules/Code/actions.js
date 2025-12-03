import Code from "@/apis/Code";
import router from "@/router/index";
import cities from "@/config/cities.json";
import states from "@/config/states.json";

export const GetCode = ({ commit, dispatch }, id) => {
    return Code.GetCode(id).then(function (response) {
        commit('SET_CODE_DATA', response.data.data);
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

export const GetAllCodes = ({ commit, dispatch }) => {
    return Code.GetAllCodes().then(function (response) {
        commit('SET_CODES_DATA', response.data.data);
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

export const GetCodesByParent = ({ commit, dispatch }, { parent1, parent2 = 0 }) => {
    return Code.GetCodesByParent(parent1, parent2).then(function (response) {
        commit('SET_CODES_DATA', response.data.data);
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

export const GetCodesByParentWithChild = ({ commit, dispatch }, { parent1, parent2 = 0 }) => {
    return Code.GetCodesByParentWithChild(parent1, parent2).then(function (response) {
        commit('SET_CODES_DATA', response.data.data);
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

export const CreateCode = ({ commit, dispatch }, data) => {
    return Code.CreateCode(data).then(function (response) {
        commit('SET_CODE_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdateCode = ({ commit, dispatch }, data) => {
    return Code.UpdateCode(data).then(function (response) {
        commit('SET_CODE_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const CreateCodeWithChild = ({ commit, dispatch }, data) => {
    return Code.CreateCodeWithChild(data).then(function (response) {
        commit('SET_CODE_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdateCodeWithChild = ({ commit, dispatch }, data) => {
    return Code.UpdateCodeWithChild(data).then(function (response) {
        commit('SET_CODE_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const DeleteCode = ({ commit, dispatch }, id) => {
    return Code.DeleteCode(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}