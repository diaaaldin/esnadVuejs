import Api from "./Api";

const END_POINT = 'NotificationMessage';

export default{

    CreateNotification(data){
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        // console.log("data : ", data)
        let config = {
            headers: {'Authorization': token , "Access-Control-Allow-Origin" : "*" },
        };
        // let config = {
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };
           const responce = Api.post(`${END_POINT}/CreateNotification`, data , config);
           return responce;
    },

    ReadNotReadNotifications(){
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: {'Authorization': token }, "Access-Control-Allow-Origin" : "*" ,
        };
        // let config = {
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };
           const responce = Api.put(`${END_POINT}/ReadNotReadNotifications`, {} ,config);
           return responce;
    },

    ReadAdminNotification(notficationId){
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

       // let config = {
         //   headers: {'Authorization': token },
        //};
       
        let config = {
            headers: {
                'Authorization': token, 
                "Access-Control-Allow-Origin" : "*" ,
                'Content-Type': 'application/json', // Set the content type if you're sending JSON data
            },
        };
        console.log("notficationId : " ,notficationId);
        console.log("config : " ,config);
           const responce = Api.put(`${END_POINT}/ReadAdminNotification`,notficationId,config);
           return responce;
    },
    
    GetUserNotifications(data){
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: {'Authorization': token , "Access-Control-Allow-Origin" : "*" },
            params: {
                page: data.page,
                pageSize : data.pageSize
            },
        };
        // let config = {
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };
           const responce = Api.get(`${END_POINT}/GetUserNotification`, config);
           return responce;
    },

    SendEmail(data){
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: {'Authorization': token , "Access-Control-Allow-Origin" : "*" },
        };
        // let config = {
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };
        const responce = Api.post(`${END_POINT}/SendEmail`, data , config);
        return responce;
    },

    SendSMS(data){
        let token =  localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null;

        let config = {
            headers: {'Authorization': token , "Access-Control-Allow-Origin" : "*" },
        };

        // let config = {
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json', // Set the content type if you're sending JSON data
        //       },
        // };

        const responce = Api.post(`${END_POINT}/SendSMS`, data , config);
        return responce;
    },

}