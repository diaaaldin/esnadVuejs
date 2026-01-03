import Api from "./Api";

const END_POINT = 'Role';

export default {

    GetPermissions() {
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

         let config = {
             headers: { 'Authorization': token },
         };

        return Api.get(`${END_POINT}/GetPermissions`, config);
    },

    UpdateUserPermission(data) {
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

  
        let config = {
            headers: { 'Authorization': token },
        };

        const responce = Api.put(`${END_POINT}/UpdateUserPermission`, data, config);
        return responce;
    },

}