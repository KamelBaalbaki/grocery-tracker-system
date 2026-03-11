const redis = require('../config/redis');

const publishReminderSet = async ({ userId, email, reminder }) => {
    await redis.xAdd("notifications.events", "*", {
        type: "reminder.set",
        userId: userId.toString(),
        email: email,
        reminderId: reminder._id.toString(),
        itemName: reminder.itemName,
        reminderDate: reminder.reminderDate.toISOString(),
    });
};
const publishReminderDue = async ({ userId, email, reminder }) => {
    await redis.xAdd("notifications.events", "*", {
        type: "reminder.due",
        userId: userId.toString(),
        email: email,
        reminderId: reminder._id.toString(),
        itemName: reminder.itemName,
    });
};

module.exports = {
    publishReminderSet,
    publishReminderDue
};