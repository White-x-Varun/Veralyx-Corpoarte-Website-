<<<<<<< HEAD
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';
import { logError } from '../utils/logger.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `A record with that ${field} already exists`;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Unauthorized';
  }

  if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body too large';
  }

  if (status >= 500) {
    logError('Unhandled error', {
      path: req.originalUrl,
      method: req.method,
      name: err.name,
      message: err.message,
    });
    if (env.isProduction) {
      message = 'Internal server error';
      errors = null;
    }
  }

  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

export default errorHandler;
=======
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';
import { logError } from '../utils/logger.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `A record with that ${field} already exists`;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Unauthorized';
  }

  if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body too large';
  }

  if (status >= 500) {
    logError('Unhandled error', {
      path: req.originalUrl,
      method: req.method,
      name: err.name,
      message: err.message,
    });
    if (env.isProduction) {
      message = 'Internal server error';
      errors = null;
    }
  }

  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

export default errorHandler;
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
