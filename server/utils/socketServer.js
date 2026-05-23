const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let ioInstance;

function getSocketToken(socket) {
  const authToken = socket.handshake.auth?.token;

  if (authToken) {
    return authToken;
  }

  const headerToken = socket.handshake.headers?.authorization;

  if (headerToken?.startsWith("Bearer ")) {
    return headerToken.slice(7);
  }

  return null;
}

function initializeSocketServer(httpServer, allowedOrigins) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  ioInstance.use((socket, next) => {
    const token = getSocketToken(socket);

    if (!token) {
      return next(new Error("Realtime authentication token is required."));
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      return next();
    } catch (_error) {
      return next(new Error("Realtime authentication failed."));
    }
  });

  ioInstance.on("connection", (socket) => {
    const { id, role } = socket.user;

    socket.join(`user:${id}`);
    socket.join(`role:${role}`);

    socket.emit("realtime:connected", {
      title: "Live sync connected",
      message: "Realtime updates are now active.",
      timestamp: new Date().toISOString(),
      role,
    });
  });

  return ioInstance;
}

function getIO() {
  return ioInstance;
}

function emitToUser(userId, eventName, payload) {
  if (!ioInstance || !userId) {
    return;
  }

  ioInstance.to(`user:${userId}`).emit(eventName, payload);
}

function emitToRole(role, eventName, payload) {
  if (!ioInstance || !role) {
    return;
  }

  ioInstance.to(`role:${role}`).emit(eventName, payload);
}

module.exports = {
  emitToRole,
  emitToUser,
  getIO,
  initializeSocketServer,
};

