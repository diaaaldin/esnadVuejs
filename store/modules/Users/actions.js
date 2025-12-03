import User from "@/apis/Users";



export const UserLogin = ({ commit, dispatch }, data) => {

    return User.UserLogin(data).then(function (response) {
        if (response.data.data.id > 0) {
            commit('USER_LOGINNAME', response.data.data.name);
            localStorage.setItem("token", JSON.stringify(response.data.data.token));
            response.data.data.token = "";
            localStorage.setItem('userName', JSON.parse(JSON.stringify(response.data.data.name)));
            localStorage.setItem('id', JSON.parse(JSON.stringify(response.data.data.id)));
            // localStorage.setItem('addressState',  JSON.parse(JSON.stringify(response.data.data.addressState)));
            
            // Call GetUser after successful login
            dispatch('GetUser').catch(function (error) {
                console.error("Error getting user info:", error);
            });

        }
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const GetUser = ({ commit, dispatch }) => {
    return User.GetUser().then(function (response) {
        commit('SET_USER_INFO', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UserProfileInfo = ({ commit, dispatch }, userId) => {
    return User.UserProfileInfo(userId).then(function (response) {
        commit('SET_USER_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const UserUpdate = ({ commit, dispatch }, data) => {
    return User.UserUpdate(data).then(function (response) {
            commit('SET_USER_DATA', response.data.data);
            return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const GetNewPassword = ({ commit, dispatch }, data) => {
    return User.GetNewPassword(data).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const ChangePassword = ({ commit, dispatch }, data) => {
    return User.ChangePassword(data).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const GetAdminUsers = ({ commit, dispatch }, data) => {
    console.log(data);
    return User.GetAdminUsers(data).then(function (response) {
        commit('SET_USERS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const CreateAdmin = ({ commit, dispatch }, data) => {
    return User.CreateAdmin(data).then(function (response) {
        commit('SET_USER_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const UpdateAdmin = ({ commit, dispatch }, data) => {
    return User.UpdateAdmin(data).then(function (response) {
        commit('SET_USER_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const DeleteAdmin = ({ commit, dispatch }, id) => {
    return User.DeleteAdmin(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const GetTeams = ({ commit, dispatch }, data) => {
    console.log(data);
    return User.GetTeams(data).then(function (response) {
        commit('SET_TEAMS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const CreateTeam = ({ commit, dispatch }, data) => {
    return User.CreateTeam(data).then(function (response) {
        commit('SET_TEAM_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const UpdateTeam = ({ commit, dispatch }, data) => {
    return User.UpdateTeam(data).then(function (response) {
        commit('SET_TEAM_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const DeleteTeam = ({ commit, dispatch }, id) => {
    return User.DeleteTeam(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const GetTeamLeaders = ({ commit, dispatch }, data) => {
    console.log(data);
    return User.GetTeamLeaders(data).then(function (response) {
        commit('SET_TEAM_LEADERS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const CreateTeamLeader = ({ commit, dispatch }, data) => {
    return User.CreateTeamLeader(data).then(function (response) {
        commit('SET_TEAM_LEADER_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const UpdateTeamLeader = ({ commit, dispatch }, data) => {
    return User.UpdateTeamLeader(data).then(function (response) {
        commit('SET_TEAM_LEADER_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const DeleteTeamLeader = ({ commit, dispatch }, id) => {
    return User.DeleteTeamLeader(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const GetTeamMembers = ({ commit, dispatch }, data) => {
    console.log(data);
    return User.GetTeamMembers(data).then(function (response) {
        commit('SET_TEAM_MEMBERS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const CreateTeamMember = ({ commit, dispatch }, data) => {
    return User.CreateTeamMember(data).then(function (response) {
        commit('SET_TEAM_MEMBER_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const UpdateTeamMember = ({ commit, dispatch }, data) => {
    return User.UpdateTeamMember(data).then(function (response) {
        commit('SET_TEAM_MEMBER_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
export const DeleteTeamMember = ({ commit, dispatch }, id) => {
    return User.DeleteTeamMember(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}




