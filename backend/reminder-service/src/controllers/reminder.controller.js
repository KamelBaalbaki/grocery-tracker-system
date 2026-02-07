const mongoose = require("mongoose");
const reminderService = require("../services/reminder.service");
const { agenda } = require("../config/agenda");
const { publishReminderSet, publishReminderDue } = require("../events/publishReminderEvents");

const createReminder = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { itemId, reminderDate, itemName, message } = req.body;

    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    if (!reminderDate) {
      return res.status(400).json({ message: "Reminder date is required" });
    }

    if (!reminderDate || isNaN(new Date(reminderDate).getTime())) {
      return res.status(400).json({ message: "Invalid reminder date" });
    }

    const reminderData = { reminderDate, itemName };
    if (message) reminderData.message = message;

    const reminder = await reminderService.createReminder(
      req.user.id,
      itemId,
      reminderData,
      itemName
    );

    await agenda.schedule(reminder.reminderDate, "send reminder", {
      reminderId: reminder._id.toString(),
    });

    await publishReminderSet({
      userId: req.user.id,
      reminder,
      itemName: reminder.itemName
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await reminderService.getUserReminders(userId);

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.reminderId)) {
      return res.status(400).json({ message: "Invalid reminder ID" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const reminder = await reminderService.updateReminder(
        req.params.reminderId,
        req.user.id,
        req.body
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await agenda.cancel({
      name: "send reminder",
      "data.reminderId": req.params.reminderId.toString(),
    });

    const now = new Date();

    if (reminder.reminderDate <= now) {

      await publishReminderDue({
        userId: req.user.id,
        reminder,
        itemName: reminder.itemName
      });
      reminder.status = "sent";
      await reminder.save();
    } else {

      reminder.status = "pending";
      await reminder.save();

      await agenda.schedule(reminder.reminderDate, "send reminder", {
        reminderId: reminder._id.toString(),
      });

      await publishReminderSet({
        userId: req.user.id,
        reminder,
        itemName: reminder.itemName
      });
    }

    res.status(200).json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.reminderId)) {
      return res.status(400).json({ message: "Invalid reminder ID" });
    }

    const reminder = await reminderService.deleteReminder(
      req.params.reminderId,
      req.user.id,
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await agenda.cancel({
      name: "send reminder",
      "data.reminderId": req.params.reminderId.toString(),
    });

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder,
};
