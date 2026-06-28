const handleTyping = (io, socket) => {
  socket.on('typing:start', (payload) => {
    const { roomId } = payload;
    socket.to(roomId).emit('typing:update', {
      roomId,
      user: {
        _id: socket.user._id,
        username: socket.user.username
      },
      isTyping: true
    });
  });

  socket.on('typing:stop', (payload) => {
    const { roomId } = payload;
    socket.to(roomId).emit('typing:update', {
      roomId,
      user: {
        _id: socket.user._id,
        username: socket.user.username
      },
      isTyping: false
    });
  });
};

module.exports = handleTyping;
