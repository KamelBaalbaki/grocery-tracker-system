const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    try {
      console.log("🔌 Client connected:", socket.id);

      const token = socket.handshake.auth.token;

      if (!token) {
        throw new Error("No token provided");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.userId;

      if (!userId) {
        throw new Error("Invalid token payload");
      }

      socket.join(userId);

      console.log(`🔐 Authenticated user: ${userId}`);
    } catch (err) {
      console.log("Socket auth failed:", err.message);
      socket.disconnect();
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
