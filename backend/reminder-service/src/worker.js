require("dotenv").config();
const startReminderWorker = require("./workers/reminder.worker");
const connectDB = require("./config/db");

connectDB();
startReminderWorker();