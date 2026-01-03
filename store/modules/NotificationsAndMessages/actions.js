import Notification from "@/apis/NotificationMessages";

export const CreateNotification = ({ commit, dispatch }, data) => {
    return Notification.CreateNotification(data).then(function (response) {
        commit('SET_NOTIFICATION_CREATED_DATA', response.data.data);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const GetUserNotifications = ({ commit, dispatch }, data) => {
        return Notification.GetUserNotifications(data).then(function (response) {
            commit('SET_USER_NOTIFICATIONS_DATA', response.data.data);
            return response.data.data;
        }).catch(function (error) {
            throw error;
        });
}

export const ReadNotReadNotifications = ({ commit, getters }) => {
    return Notification.ReadNotReadNotifications().then(function (response) {
        let notiIds = response.data.data;
        
        let notificationsData = getters.getUserNotificationsData;
        let notificationArray = notificationsData.notifications.data;

        notificationsData.notReadNum = 0;
        commit('SET_USER_NOTIFICATIONS_DATA', notificationsData);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const ReadAdminNotification = ({ commit, getters }, notficationId) => {
    return Notification.ReadAdminNotification(notficationId).then(function (response) {
        let notiId = response.data.data;
        let notificationsData = getters.getAdminNotificationsData;
        let notificationArray = notificationsData.notifications.data;
        notificationArray.forEach(notification => {
            // Check if the notification ID is in the list of IDs to update
            if (notiId === notification.id && notification.isRead == false) {
                notification.isRead = true; // Mark as read or perform other updates
                notificationsData.notReadNum = notificationsData.notReadNum - 1;

            }
        });
        notificationsData.notifications.data = notificationArray;
        commit('SET_ADMIN_NOTIFICATIONS_DATA', notificationsData);
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const SendSMS = ({ commit, getters }, data) => {
    return Notification.SendSMS(data).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}

export const SendEmail = ({ commit, getters }, data) => {
    return Notification.SendEmail(data).then(function (response) {
        return response.data.data;
    }).catch(function (error) {
        throw error;
    });
}
