const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error with Pino
  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
    },
    req: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    },
    user: req.user ? req.user.id : 'unauthenticated',
  }, 'Application Error');

  // Development vs Production error response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or unknown errors: don't leak details
      logger.error('CRITICAL ERROR:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};

// Handle unhandled routes (404)
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
  next(err);
};

module.exports = { errorHandler, notFoundHandler, AppError };