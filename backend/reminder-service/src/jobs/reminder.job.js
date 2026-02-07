const Reminder = require("../models/reminder.model");
const { publishReminderDue } = require("../events/publishReminderEvents");

const defineReminderJob = (agenda) => {
    agenda.define("send reminder", async (job) => {
        const { reminderId } = job.attrs.data;
        const reminder = await Reminder.findById(reminderId);
        if (!reminder || reminder.status !== "pending") {
            await job.remove();
            return;
        }

        await publishReminderDue({
            userId: reminder.userId,
            reminder,
            itemName: reminder.itemName
        });

        reminder.status = "sent";
        await reminder.save();

        await job.remove();
    });
}

module.exports = defineReminderJob;