import PeopleProject from "@/apis/PeopleProjects";

export const GetPeopleProjectsByProjectId = ({ commit, dispatch }, data) => {
    return PeopleProject.GetPeopleProjectsByProjectId(data).then(function (response) {
        // API response structure: { data: { people: { pagination: {...}, data: [...] } } }
        const responseData = response.data.data || {};
        const peopleData = responseData.people || responseData;
        
        const paginationInfo = peopleData.pagination || {};
        const peopleProjectsList = peopleData.data || [];
        
        commit('SET_PEOPLE_PROJECTS_DATA', peopleProjectsList);
        commit('SET_PEOPLE_PROJECTS_PAGINATION', {
            data: peopleProjectsList,
            totalItems: paginationInfo.rowCount || 0,
            totalPages: paginationInfo.pageCount || 0,
            currentPage: paginationInfo.currentPage || data.page || 1,
            pageSize: paginationInfo.pageSize || data.pageSize || 5
        });

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

export const CreatePeopleProject = ({ commit, dispatch }, data) => {
    return PeopleProject.CreatePeopleProject(data).then(function (response) {
        commit('SET_PEOPLE_PROJECT_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdatePeopleProject = ({ commit, dispatch }, data) => {
    return PeopleProject.UpdatePeopleProject(data).then(function (response) {
        commit('SET_PEOPLE_PROJECT_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const DeletePeopleProject = ({ commit, dispatch }, id) => {
    return PeopleProject.DeletePeopleProject(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

