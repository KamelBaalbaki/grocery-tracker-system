const mongoose = require("mongoose");
const Reminder = require("../models/reminder.model");

const createReminder = async (userId, itemId, data) => {
    return await Reminder.create({
        userId,
        itemId,
        ...data,
    });
}

const getUserReminders = async (userId) => {
    return await Reminder.find({ userId });
}

const updateReminder = async (reminderId, userId, data) => {
    return await Reminder.findOneAndUpdate(
        { _id: reminderId, userId },
        { $set: data },
        { new: true },
        { runValidators: true }
    );
}

const deleteReminder = async (reminderId, userId) => {
    return await Reminder.findOneAndDelete({ _id: reminderId, userId });
}   

module.exports = {
    createReminder,
    getUserReminders,
    updateReminder,
    deleteReminder
};