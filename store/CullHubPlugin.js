import callHub from '../src/CallHub.js';


const callHubPlugin = store => {
    // callHub.start(); // Start the SignalR connection
    // // First Listener
    // callHub.client.on("ClientsNotificationCall", data => {
    //     // Ensure data is an array
    //     if (!Array.isArray(data)) {
    //         console.error("Data is not an array");
    //         return;
    //     }
    //     let id = localStorage.getItem("id");
    //     // Check if id is null or undefined
    //     if (id === null || id === undefined) {
    //         // console.error("ID is null or undefined");
    //         return;
    //     }
    //     // Convert id to a number since userId is a number in the data
    //     id = parseInt(id, 10);
    //     // Find the item with the matching userId
    //     const foundItem = data.find(element => element.userId === id);
    //     if (foundItem) {
    //         store.commit('NotificationsAndMessages/SET_USER_NOTIFICATIONS_DATA', foundItem);
    //     } else {
    //         //console.warn("No item found with the matching userId");
    //     }
    // });

    // Second Listener
    // callHub.client.on("AdminsNotificationCall", data => {

    //     let isAdmin = localStorage.getItem("isAdmin");
    //     if (isAdmin) {
    //         store.commit('NotificationsAndMessages/SET_ADMIN_NOTIFICATIONS_DATA', data);
    //     } else {
    //         console.warn("error when map data");
    //     }
    // });

};

export default callHubPlugin;