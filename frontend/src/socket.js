import { io } from "socket.io-client";

let socket = null;

/**
 * Returns a singleton socket, creating it on first call.
 * Token is passed via auth handshake so the server can verify identity.
 */
export function getSocket(token) {
  if (!socket || socket.disconnected) {
    socket = io("http://localhost:5000", {
      auth: { token },
      autoConnect: true,
      transports: ["websocket"],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
