const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId
    },
    reminderId: {
      type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    url: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);