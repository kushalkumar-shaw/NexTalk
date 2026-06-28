const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');
const handleConnection = require('./handlers/connection.handler');
const handleRoom = require('./handlers/room.handler');
const handleMessage = require('./handlers/message.handler');
const handleTyping = require('./handlers/typing.handler');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      if (!token && socket.handshake.headers?.cookie) {
        const cookies = socket.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        token = cookies.nexttalk_token;
      }

      if (!token) {
        return next(new Error('Authentication failed'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded._id).select('_id username avatar');
      
      if (!user) {
        return next(new Error('Authentication failed'));
      }

      socket.user = user;
      next();
    } catch (error) {
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    handleConnection(io, socket);
    handleRoom(io, socket);
    handleMessage(io, socket);
    handleTyping(io, socket);
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIo };
