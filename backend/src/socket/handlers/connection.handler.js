const User = require('../../models/User.model');

const handleConnection = async (io, socket) => {
  const userId = socket.user._id;

  try {
    await User.findByIdAndUpdate(userId, { isOnline: true });
    socket.join(`user:${userId}`);

    socket.broadcast.emit('user:online', {
      userId,
      username: socket.user.username
    });
  } catch (error) {
    console.error('Error in connection handler:', error);
  }

  socket.on('disconnect', async () => {
    try {
      const lastSeen = Date.now();
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen
      });

      io.emit('user:offline', {
        userId,
        lastSeen
      });
    } catch (error) {
      console.error('Error in disconnect handler:', error);
    }
  });
};

module.exports = handleConnection;
