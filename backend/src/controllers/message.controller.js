const Message = require('../models/Message.model');
const Room = require('../models/Room.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const mongoose = require('mongoose');

const getMessagesByRoom = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;
  const currentUserId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return next(ApiError.badRequest('Invalid room ID format'));
  }

  const room = await Room.findById(roomId);

  if (!room) {
    return next(ApiError.notFound('Room not found'));
  }

  if (room.type === 'private' && !room.members.includes(currentUserId)) {
    return next(ApiError.forbidden('You are not a member of this private room'));
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({ room: roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', '_id username avatar');

  const totalMessages = await Message.countDocuments({ room: roomId });
  const totalPages = Math.ceil(totalMessages / limit);
  const hasMore = page < totalPages;

  res.status(200).json(new ApiResponse(200, 'Messages retrieved successfully', {
    messages,
    pagination: {
      currentPage: page,
      totalPages,
      totalMessages,
      hasMore
    }
  }));
});

module.exports = { getMessagesByRoom };
