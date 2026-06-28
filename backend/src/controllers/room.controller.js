const Room = require('../models/Room.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const mongoose = require('mongoose');

const createRoom = asyncHandler(async (req, res, next) => {
  const { name, description, type } = req.body;
  const currentUserId = req.user._id;

  const existingRoom = await Room.findOne({ name });
  if (existingRoom) {
    return next(ApiError.conflict('Room name already exists'));
  }

  const room = await Room.create({
    name,
    description,
    type,
    createdBy: currentUserId,
    members: [currentUserId]
  });

  res.status(201).json(new ApiResponse(201, 'Room created successfully', { room }));
});

const getRooms = asyncHandler(async (req, res, next) => {
  const currentUserId = req.user._id;

  const rooms = await Room.find({
    $or: [
      { type: 'public' },
      { members: currentUserId }
    ]
  }).populate('createdBy', '_id username avatar');

  res.status(200).json(new ApiResponse(200, 'Rooms retrieved successfully', { rooms }));
});

const getRoomById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUserId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest('Invalid room ID format'));
  }

  const room = await Room.findById(id).populate('members', '_id username avatar').populate('createdBy', '_id username avatar');

  if (!room) {
    return next(ApiError.notFound('Room not found'));
  }

  if (room.type === 'private' && !room.members.some(member => member._id.toString() === currentUserId.toString())) {
    return next(ApiError.forbidden('You are not a member of this private room'));
  }

  res.status(200).json(new ApiResponse(200, 'Room retrieved successfully', { room }));
});

const joinRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUserId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest('Invalid room ID format'));
  }

  const room = await Room.findById(id);

  if (!room) {
    return next(ApiError.notFound('Room not found'));
  }

  if (!room.members.includes(currentUserId)) {
    room.members.push(currentUserId);
    await room.save();
  }

  res.status(200).json(new ApiResponse(200, 'Joined room successfully', { room }));
});

const leaveRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUserId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest('Invalid room ID format'));
  }

  const room = await Room.findById(id);

  if (!room) {
    return next(ApiError.notFound('Room not found'));
  }

  room.members = room.members.filter(memberId => memberId.toString() !== currentUserId.toString());
  await room.save();

  res.status(200).json(new ApiResponse(200, 'Left room successfully', null));
});

const deleteRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUserId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest('Invalid room ID format'));
  }

  const room = await Room.findById(id);

  if (!room) {
    return next(ApiError.notFound('Room not found'));
  }

  if (room.createdBy.toString() !== currentUserId.toString()) {
    return next(ApiError.forbidden('Only the room creator can delete this room'));
  }

  await room.deleteOne();

  res.status(200).json(new ApiResponse(200, 'Room deleted successfully', null));
});

const addMember = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;
  const currentUserId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
    return next(ApiError.badRequest('Invalid ID format'));
  }

  const room = await Room.findById(id);
  if (!room) return next(ApiError.notFound('Room not found'));

  // Ensure current user is a member
  if (!room.members.includes(currentUserId)) {
    return next(ApiError.forbidden('Only room members can add new users'));
  }

  const userToAdd = await mongoose.model('User').findById(userId).select('_id username avatar');
  if (!userToAdd) return next(ApiError.notFound('User to add not found'));

  if (room.members.includes(userId)) {
    return next(ApiError.conflict('User is already a member'));
  }

  room.members.push(userId);
  await room.save();

  const populatedRoom = await Room.findById(id).populate('createdBy', '_id username avatar').populate('members', '_id username avatar');

  try {
    const { getIo } = require('../socket/socket');
    const io = getIo();
    io.to(`user:${userId}`).emit('room:added', populatedRoom);
    io.to(id).emit('room:member_added', { roomId: id, user: userToAdd });
  } catch (e) {
    console.error('Socket error in addMember:', e);
  }

  res.status(200).json(new ApiResponse(200, 'User added to room successfully', { room: populatedRoom }));
});

module.exports = { createRoom, getRooms, getRoomById, joinRoom, leaveRoom, deleteRoom, addMember };
