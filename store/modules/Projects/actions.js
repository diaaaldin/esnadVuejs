import Project from "@/apis/Projects";

export const GetAllProjects = ({ commit, dispatch }, data) => {
    return Project.GetAllProjects(data).then(function (response) {
        // API response structure: { data: { projects: { pagination: {...}, data: [...] } } }
        const responseData = response.data.data || {};
        const projectsData = responseData.projects || responseData;
        console.log("projectsData : ", projectsData);
        
        const paginationInfo = projectsData.pagination || {};
        const projectsList = projectsData.data || [];
        
        commit('SET_PROJECTS_DATA', projectsList);
        commit('SET_PROJECTS_PAGINATION', {
            data: projectsList,
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

export const CreateProject = ({ commit, dispatch }, data) => {
    return Project.CreateProject(data).then(function (response) {
        commit('SET_PROJECT_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdateProject = ({ commit, dispatch }, data) => {
    return Project.UpdateProject(data).then(function (response) {
        commit('SET_PROJECT_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const DeleteProject = ({ commit, dispatch }, id) => {
    return Project.DeleteProject(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const CreateProjectsFromExcel = ({ commit, dispatch }, file) => {
    return Project.CreateProjectsFromExcel(file).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

