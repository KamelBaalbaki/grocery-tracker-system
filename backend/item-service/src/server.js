require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4002;

connectDB();

app.listen(PORT, () => {
    console.log(`Item Service running on port ${PORT}`);
});