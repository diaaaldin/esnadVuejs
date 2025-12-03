import Vehicle from "@/apis/Vehicle";

export const GetVehicelForUpdate = ({ commit, dispatch },id) => {
    // console.log("action run ");
    return Vehicle.GetVehicelForUpdate(id).then(function (response) {
        commit('SET_VEHICEL_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}

export const GetVehiclesManagment = ({ commit, dispatch },data) => {
    return Vehicle.GetVehiclesManagment(data).then(function (response) {
        commit('SET_VEHICLES_MANEGMENT_DATA', response.data.data);
        return response.data.data; 
    }).catch(function (error) {
            throw error;
    });
}

export const GetVehicleUpdateInfo = ({ commit, dispatch },VehicleId) => {
    return Vehicle.GetVehicleUpdateInfo(VehicleId).then(function (response) {
        commit('GET_UPDATE_VEHICELS_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}

export const UpdateVehicle = ({ commit, dispatch },data) => {
    return Vehicle.UpdateVehicle(data).then(function (response) {
        commit('SET_CREATE_UPDATE_VEHICEL_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}

export const CreateVehicle = ({ commit, dispatch },data) => {
     return Vehicle.CreateVehicle(data).then(function (response) {
         commit('SET_CREATE_UPDATE_VEHICEL_DATA', response.data.data);
         return response.data.data; 
     }).catch(function (error) {
             throw error;
     });
}

export const DeleteVehicle = ({ commit, dispatch },VehicleId) => {
    return Vehicle.DeleteVehicle(VehicleId).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}

export const UpdateVehicleStatus = ({ commit, dispatch },data) => {
    return Vehicle.UpdateVehicleStatus(data).then(function (response) {
        commit('SET_CREATE_UPDATE_VEHICEL_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}

export const UpdateVehicleImage360 = ({ commit, dispatch },data) => {
    return Vehicle.UpdateVehicleImage360(data).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
            throw error;
    });
}
