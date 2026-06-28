const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const mongoose = require('mongoose');

const getUsers = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  const currentUserId = req.user._id;

  const query = { _id: { $ne: currentUserId } };

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query).select('-password');
  res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', { users }));
});

const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest('Invalid user ID format'));
  }

  const user = await User.findById(id).select('-password');

  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  res.status(200).json(new ApiResponse(200, 'User retrieved successfully', { user }));
});

module.exports = { getUsers, getUserById };
