const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    itemName: {
        type: String,
        required: true
    },
    message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reminder", reminderSchema);
