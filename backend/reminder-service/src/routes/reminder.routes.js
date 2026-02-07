const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const reminderController = require('../controllers/reminder.controller');

router.use(protect);

router.post("/", reminderController.createReminder);
router.get('/', reminderController.getUserReminders);
router.put('/:reminderId', reminderController.updateReminder);
router.delete('/:reminderId', reminderController.deleteReminder);

module.exports = router;