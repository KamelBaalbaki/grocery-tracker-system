const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

router.use(protect);

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getUserNotifications);
router.put('/:notificationId/read', notificationController.markNotificationAsRead);
router.put('/read-all', notificationController.markAllNotificationsAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);
router.delete('/', notificationController.deleteAllNotifications);

module.exports = router;