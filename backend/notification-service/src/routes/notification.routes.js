const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

router.use(auth);

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getUserNotifications);
router.put('/:notificationId/read', notificationController.markNotificationAsRead);
router.put('/read-all', notificationController.markAllNotificationsAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);
router.delete('/', notificationController.deleteAllNotifications);

module.exports = router;