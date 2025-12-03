import Api from "./Api";

const END_POINT = 'Vehicle';


export default {

    GetVehicle(id) {

        let config = {
            params: {
                id: id,
            },
        };

        const responce = Api.get(`${END_POINT}/GetVehicle`, config);
        return responce;
    },

    GetVehicelForUpdate(id) {

        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                id: id,
            },
        };

        const responce = Api.get(`${END_POINT}/GetVehicelForUpdate`, config);
        return responce;
    },

    GetVehiclesManagment(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: {
                'Authorization': token,
                'Access-Control-Allow-Origin': '*'
            },
            params: {
                ...data.vm, // Spread the VehicleManagmentSearch object properties as query parameters
                page: data.page, // Add the page query parameter
                pageSize: data.pageSize // Add the pageSize query parameter
            }
        };

        console.log("config: ", config);
        const response = Api.get(`${END_POINT}/GetVehiclesManagment`, config);
        return response;
    },

    GetVehicleUpdateInfo(vehicleId) {

        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                vehicleId: vehicleId,
            },
        };

        // let config = {
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };

        const responce = Api.get(`${END_POINT}/GetVehicleUpdateInfo`, config);
        return responce;
    },

    CreateVehicle(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;
        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };
        // let config = {
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };
        const responce = Api.post(`${END_POINT}/CreateVehicle`, data, config);
        return responce;
    },

    UpdateVehicle(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        console.log("this.data : " , data);
        const responce = Api.put(`${END_POINT}/UpdateVehicle`, data, config);
        return responce;
    },

    DeleteVehicle(VehicleId) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
            params: {
                Id: VehicleId
            }
        };
        //let config = {
        //    headers: {
        //        'Authorization': token,
        //        'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //      },
        //};
        const responce = Api.delete(`${END_POINT}/DeleteVehicle`, config);
        return responce;
    },

    UpdateVehicleStatus(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.put(`${END_POINT}/UpdateVehicleStatus`, data, config);
        return responce;
    },

    UpdateVehicleImage360(data) {
        let token = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;

        let config = {
            headers: { 'Authorization': token, "Access-Control-Allow-Origin": "*" },
        };

        const responce = Api.put(`${END_POINT}/UpdateVehicleImage360`, data, config);
        return responce;
    },

}