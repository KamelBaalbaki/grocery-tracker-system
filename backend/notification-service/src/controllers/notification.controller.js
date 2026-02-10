const notificationService = require('../services/notification.service');
const mongoose = require('mongoose');

const createNotification = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is required"});
        }
        const notification = await notificationService.createNotification(req.user.id, req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Internal server error"});
    }
};

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user.id);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Internal server error"});
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.notificationId)) {
            return res.status(404).json({ message: "Notification not found"});
        } const notification = await notificationService.markNotificationAsRead(
            req.user.id,
            req.params.notificationId,
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Internal server error"});
    }
}

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const notifications = await notificationService.markAllNotificationsAsRead(req.user.id);

        if (notifications.matchedCount === 0) {
            return res.status(404).json({
                message: "No unread notifications to mark"
            });
        }

        return res.status(200).json({
            message: "All notifications marked as read",
            updatedCount: notifications.modifiedCount
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


const deleteNotification = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.notificationId)) {
            return res.status(404).json({ message: "notification not found" });
        }
        const notification = await notificationService.deleteNotification(req.user.id, req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ message: "notification not found" });
        }
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.deleteAllNotifications(req.user.id);
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error"});
    }
}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications
}