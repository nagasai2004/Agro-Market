import { io } from "socket.io-client";

let socket;

function getRealtimeUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
}

export function connectRealtime(token) {
  if (!token) {
    return null;
  }

  const realtimeUrl = getRealtimeUrl();

  if (socket) {
    const existingUrl = socket.io?.uri || socket.io?.opts?.hostname;

    if (existingUrl?.includes(realtimeUrl) && socket.auth?.token === token) {
      if (!socket.connected) {
        socket.connect();
      }

      return socket;
    }

    socket.disconnect();
  }

  socket = io(realtimeUrl, {
    transports: ["websocket"],
    auth: { token },
  });

  return socket;
}

export function disconnectRealtime() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

