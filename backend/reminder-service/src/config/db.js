const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected (Reminder Service)");
    } catch (error) {
        console.error("DB connection failed", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;