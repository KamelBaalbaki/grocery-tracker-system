require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const startConsumer = require("./events/notification.consumer");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 4004;

connectDB();

const server = http.createServer(app);

initSocket(server);

startConsumer();

server.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});