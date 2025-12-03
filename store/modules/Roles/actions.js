import Role from "@/apis/Roles";

export const GetPermissions = ({ commit, dispatch }) => {
    return Role.GetPermissions().then(function (response) {
        commit('SET_USER_PERMISSIONS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}

export const UpdateUserPermission = ({ commit, dispatch } , data) => {
    return Role.UpdateUserPermission(data).then(function (response) {
        //commit('SET_STORE_PERMISSIONS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}
