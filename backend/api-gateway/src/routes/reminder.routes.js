const express = require('express');
const protect = require('../middleware/auth.middleware');
const reminderProxy = require('../proxy/reminder.proxy');

const router = express.Router();

router.use(protect);
router.use('/', reminderProxy);

module.exports = router;
