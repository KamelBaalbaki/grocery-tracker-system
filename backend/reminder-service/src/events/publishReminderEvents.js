const redis = require('../config/redis');

const publishReminderSet = async ({ userId, reminder, itemName }) => {
    await redis.xAdd("notifications.events", "*", {
        type: "reminder.set",
        userId: userId.toString(),
        reminderId: reminder._id.toString(),
        itemName: reminder.itemName,
        reminderDate: reminder.reminderDate.toISOString(),
    });
};
const publishReminderDue = async ({ userId, reminder, itemName }) => {
    await redis.xAdd("notifications.events", "*", {
        type: "reminder.due",
        userId: userId.toString(),
        reminderId: reminder._id.toString(),
        itemName: reminder.itemName,
    });
};

module.exports = {
    publishReminderSet,
    publishReminderDue
};