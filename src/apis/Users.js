import Api from "./Api";

const END_POINT = 'User';



export default {

    UserLogin(data) {
        return Api.post(`${END_POINT}/UserLogin`, data);
    },

    GetUser() {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.get(`${END_POINT}/GetUser`, config);
    },

    UserProfileInfo(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                userId: id
            },
        };
        return Api.get(`${END_POINT}/UserProfileInfo`, config);
    },
    UserUpdate(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
         
        return Api.put(`${END_POINT}/UpdateUser`, data, config);
    },

    GetAdminUsers(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                name: data.name,
            },
        };
        return Api.get(`${END_POINT}/GetAdminUsers`, config);
    },

    CreateAdmin(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.post(`${END_POINT}/CreateAdmin`, data, config);
    },
    UpdateAdmin(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.put(`${END_POINT}/UpdateAdmin`, data, config);
    },
    DeleteAdmin(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                id: id
            }
        };
        //let config = {
        //    headers: {
        //        'Authorization': token
        //        'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //      },
        //};
        const responce = Api.delete(`${END_POINT}/DeleteAdmin`, config);
        return responce;
    },

    GetTeams(data = {}) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                name: data?.name || "",
            },
        };
        return Api.get(`${END_POINT}/GetTeams`, config);
    },
    CreateTeam(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.post(`${END_POINT}/CreateTeam`, data, config);
    },
    UpdateTeam(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.put(`${END_POINT}/UpdateTeam`, data, config);
    },
    DeleteTeam(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                id: id
            }
        };
        const responce = Api.delete(`${END_POINT}/DeleteTeam`, config);
        return responce;
    },

    GetTeamLeaders(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                name: data.name || "",
                teamId: data.teamId || 0,
            },
        };
        return Api.get(`${END_POINT}/GetTeamLeaders`, config);
    },
    CreateTeamLeader(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.post(`${END_POINT}/CreateTeamLeader`, data, config);
    },
    UpdateTeamLeader(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.put(`${END_POINT}/UpdateTeamLeader`, data, config);
    },
    DeleteTeamLeader(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                id: id
            }
        };
        const responce = Api.delete(`${END_POINT}/DeleteTeamLeader`, config);
        return responce;
    },

    GetTeamMembers(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                name: data.name || "",
                teamId: data.teamId || 0,
            },
        };
        return Api.get(`${END_POINT}/GetTeamMembers`, config);
    },
    CreateTeamMember(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.post(`${END_POINT}/CreateTeamMember`, data, config);
    },
    UpdateTeamMember(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };
        return Api.put(`${END_POINT}/UpdateTeamMember`, data, config);
    },
    DeleteTeamMember(id) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
            params: {
                id: id
            }
        };
        const responce = Api.delete(`${END_POINT}/DeleteTeamMember`, config);
        return responce;
    },

    
    GetNewPassword(data) {
        // Backend action is [HttpPost] GetNewPassword, so we must use POST here
        const responce = Api.post(`${END_POINT}/GetNewPassword`, data);
        return responce;
    },
    ChangePassword(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token },
        };

        // let config = {
        //     headers: {
        //         'Authorization': token
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };

        const responce = Api.post(`${END_POINT}/ChangePassword`, data, config);
        return responce;
    },

}