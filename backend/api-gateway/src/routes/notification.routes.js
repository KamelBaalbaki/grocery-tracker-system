const express = require('express');
const protect = require('../middleware/auth.middleware');
const notificationProxy = require('../proxy/notification.proxy');

const router = express.Router();

router.use(protect);
router.use('/', notificationProxy);

module.exports = router;
