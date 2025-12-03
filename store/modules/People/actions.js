import People from "@/apis/People";

export const GetAllPeople = ({ commit, dispatch }, data) => {
    return People.GetAllPeople(data).then(function (response) {
        // API response structure: { data: { people: { pagination: {...}, data: [...] } } }
        const responseData = response.data.data || {};
        const peopleData = responseData.people || responseData;
        console.log("peopleData : ", peopleData);
        
        const paginationInfo = peopleData.pagination || {};
        const peopleList = peopleData.data || [];
        
        commit('SET_PEOPLE_DATA_LIST', peopleList);
        commit('SET_PEOPLE_PAGINATION', {
            data: peopleList,
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

export const CreatePeople = ({ commit, dispatch }, data) => {
    return People.CreatePeople(data).then(function (response) {
        commit('SET_PEOPLE_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const UpdatePeople = ({ commit, dispatch }, data) => {
    return People.UpdatePeople(data).then(function (response) {
        commit('SET_PEOPLE_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const DeletePeople = ({ commit, dispatch }, id) => {
    return People.DeletePeople(id).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const CreatePeopleFromExcel = ({ commit, dispatch }, { file, projectId, exceptionPeriod }) => {
    return People.CreatePeopleFromExcel(file, projectId, exceptionPeriod).then(function (response) {
        const contentType = response.headers['content-type'] || '';
        
        // Check if response is a file download (rejected rows Excel)
        if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            // Handle file download
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Extract filename from content-disposition header or use default
            let filename = 'People_Rejected.xlsx';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            return { isFileDownload: true, message: 'تم تنزيل ملف الصفوف المرفوضة' };
        }
        
        // Handle JSON response (success case)
        // Since responseType is 'blob', we need to convert blob to text then parse JSON
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const jsonResponse = JSON.parse(reader.result);
                    // Backend returns ApiResponse structure: { statusCode, message, data }
                    if (jsonResponse.data) {
                        resolve(jsonResponse.data);
                    } else {
                        resolve(jsonResponse);
                    }
                } catch (e) {
                    reject(new Error('Failed to parse response'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read response'));
            reader.readAsText(response.data);
        });
    }).catch(function (error) {
        // Handle error responses (400, 500) - they might also be blobs when responseType is 'blob'
        if (error.response && error.response.data && error.response.data instanceof Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const jsonError = JSON.parse(reader.result);
                        // Create error object with proper structure
                        const apiError = new Error(jsonError.message || 'An error occurred');
                        apiError.response = {
                            ...error.response,
                            data: jsonError
                        };
                        reject(apiError);
                    } catch (e) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(error);
                reader.readAsText(error.response.data);
            });
        }
        throw error;
    });
}
