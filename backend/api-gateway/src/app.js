const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const itemRoutes = require('./routes/item.routes');
const reminderRoutes = require('./routes/reminder.routes');
const notificationRoutes = require('./routes/notification.routes');
const recipeRoutes = require('./routes/recipe.routes');

const app = express();

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recipes', recipeRoutes);

app.use(express.json());

module.exports = app;