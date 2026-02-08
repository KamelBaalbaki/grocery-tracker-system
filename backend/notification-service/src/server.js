require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const startConsumer = require("./events/notification.consumer");

const PORT = process.env.PORT || 4004;

connectDB();
startConsumer();


app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});

