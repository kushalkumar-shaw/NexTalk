const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const generateToken = require('../utils/generateToken');
const env = require('../config/env');

const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) {
      return next(ApiError.conflict('Email already exists'));
    }
    return next(ApiError.conflict('Username already exists'));
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);

  res.cookie('nexttalk_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  });

  res.status(201).json(new ApiResponse(201, 'Account created successfully', { user, token }));
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(ApiError.unauthorized('Invalid email or password'));
  }

  user.isOnline = true;
  user.lastSeen = Date.now();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  res.cookie('nexttalk_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  });

  const userObject = user.toObject();
  delete userObject.password;

  res.status(200).json(new ApiResponse(200, 'Logged in successfully', { user: userObject, token }));
});

const logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.isOnline = false;
    user.lastSeen = Date.now();
    await user.save({ validateBeforeSave: false });
  }

  res.cookie('nexttalk_token', 'none', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1
  });

  res.status(200).json(new ApiResponse(200, 'Logged out successfully', null));
});

const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(new ApiResponse(200, 'User profile retrieved', { user: req.user }));
});

module.exports = { register, login, logout, getMe };
