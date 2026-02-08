const Notification = require('../models/notification.model');

const createNotification = async (userId, data) => {
    return await Notification.create({ ...data, userId });
}

const getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1});
}

const markNotificationAsRead = async (userId, notificationId) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, userId, isRead: false },
        { $set: { isRead: true} },
        { new: true }
    );
}

const markAllNotificationsAsRead = async (userId) => {
    return await Notification.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } },
    );
}

const deleteNotification = async (userId, notificationId) => {
    return await Notification.findOneAndDelete({ _id: notificationId, userId });
}

const deleteAllNotifications = async (userId) => {
    return await Notification.deleteMany({ userId })
}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications
}