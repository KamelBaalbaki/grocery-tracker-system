require("dotenv").config();
const { initAgenda } = require("./config/agenda");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4003;

connectDB().then(async () => {
    await initAgenda();
});

app.listen(PORT, () => {
    console.log(`Reminder Service running on port ${PORT}`);
});