const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not already an ApiError, create a generic one or map Mongoose errors
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong';
    let errors = [];

    // Mongoose ValidationError
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      errors = Object.values(error.errors).map(el => ({
        field: el.path,
        message: el.message
      }));
    }

    // Mongoose CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      statusCode = 409;
      message = 'Duplicate field value';
    }

    // JWT Errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token has expired';
    }

    error = new ApiError(statusCode, message, errors);
  }

  const response = {
    success: false,
    message: error.message
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
