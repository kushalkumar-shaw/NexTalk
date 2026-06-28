const Room = require('../../models/Room.model');

const handleRoom = (io, socket) => {
  socket.on('room:join', async (payload) => {
    try {
      const { roomId } = payload;
      const room = await Room.findById(roomId);

      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      if (room.type === 'private' && !room.members.some(memberId => memberId.toString() === socket.user._id.toString())) {
        return socket.emit('error', { message: 'You are not a member of this room' });
      }

      socket.join(roomId);
      socket.emit('room:joined', { roomId, room });

      socket.to(roomId).emit('room:user_joined', {
        roomId,
        user: socket.user
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('room:leave', (payload) => {
    try {
      const { roomId } = payload;
      socket.leave(roomId);
      
      socket.emit('room:left', { roomId });
      socket.to(roomId).emit('room:user_left', {
        roomId,
        userId: socket.user._id
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to leave room' });
    }
  });
};

module.exports = handleRoom;
