import Api from "./Api";

const END_POINT = 'Interfaces';

export default{
   
    GetInterfaceItem(id){
        let config = {
            params: {
                id: id
            },
          };
        return Api.get(`${END_POINT}/GetInterfaceItem`, config );
    },

    GetInterfaceItems(interfaceId){
        let config = {
            params: {
                interfaceId: interfaceId
            },
          };
        return Api.get(`${END_POINT}/GetInterfaceItems`, config );
    },

  

    CreateInterfaceItem(data){
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: {'Authorization': token  },
        };
        // let config = {
        //     headers: {
        //         'Authorization': token
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };
           const responce = Api.post(`${END_POINT}/CreateInterfaceItem`, data , config);
           return responce;
    },
    UpdateInterfaceItem(data){
        
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: {'Authorization': token  },
        };

           const responce = Api.put(`${END_POINT}/UpdateInterfaceItem`, data , config);
           return responce;
    },
    DeleteInterfaceItem(id){
        let token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: {'Authorization': token  },
            params : {
                id : id
            }
        };
        //let config = {
        //    headers: {
        //        'Authorization': token
        //        'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //      },
        //};
        const responce = Api.delete(`${END_POINT}/DeleteInterfaceItem`, config);
        return responce;
    },






}