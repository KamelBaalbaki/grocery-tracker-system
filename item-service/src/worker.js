require("dotenv").config();

const connectDB = require("./config/db");
const startExpirationWorker = require('./workers/expiration.worker')

connectDB();
startExpirationWorker();
