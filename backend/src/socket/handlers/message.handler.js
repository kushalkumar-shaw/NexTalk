const Message = require('../../models/Message.model');

const handleMessage = (io, socket) => {
  socket.on('message:send', async (payload) => {
    try {
      console.log('Received message:send event from user:', socket.user._id, 'payload:', payload);
      const { roomId, content } = payload;

      if (!content || content.trim().length === 0 || content.length > 2000) {
        return socket.emit('message:error', { message: 'Invalid message content' });
      }

      const message = await Message.create({
        content: content.trim(),
        sender: socket.user._id,
        room: roomId,
        type: 'text',
        readBy: [socket.user._id]
      });

      const populatedMessage = await Message.findById(message._id).populate('sender', '_id username avatar');

      io.to(roomId).emit('message:new', populatedMessage);
    } catch (error) {
      socket.emit('message:error', { message: 'Failed to send message' });
    }
  });

  socket.on('message:read', async (payload) => {
    try {
      const { messageId } = payload;

      const message = await Message.findById(messageId);
      if (!message) return;

      if (!message.readBy.includes(socket.user._id)) {
        message.readBy.push(socket.user._id);
        await message.save();

        io.to(message.room.toString()).emit('message:read_receipt', {
          messageId,
          readBy: socket.user._id
        });
      }
    } catch (error) {
      console.error('Error in message:read handler:', error);
    }
  });
};

module.exports = handleMessage;
