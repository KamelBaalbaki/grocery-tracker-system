const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const reminderController = require('../controllers/reminder.controller');

router.use(auth);

router.post("/", reminderController.createReminder);
router.get('/', reminderController.getUserReminders);
router.put('/:reminderId', reminderController.updateReminder);
router.delete('/:reminderId', reminderController.deleteReminder);

module.exports = router;