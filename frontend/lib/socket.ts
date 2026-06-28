import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const createSocket = (token: string): Socket => {
  if (socket) return socket;
  
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
  
  socket = io(socketUrl, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"]
  });

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket.io not initialised. Call createSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
