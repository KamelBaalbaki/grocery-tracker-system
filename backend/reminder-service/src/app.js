const express = require('express');
const cors = require('cors');

const reminderRoutes = require('./routes/reminder.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reminders", reminderRoutes);

module.exports = app;