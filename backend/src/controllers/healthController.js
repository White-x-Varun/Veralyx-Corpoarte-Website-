<<<<<<< HEAD
import mongoose from 'mongoose';
import env from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';

export const health = asyncHandler(async (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  const healthy = mongoose.connection.readyState === 1 || env.isTest;

  return res.status(healthy ? 200 : 503).json({
    success: healthy,
    data: {
      status: healthy ? 'ok' : 'degraded',
      uptime: process.uptime(),
      environment: env.nodeEnv,
      database: dbState,
    },
  });
});
=======
import mongoose from 'mongoose';
import env from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';

export const health = asyncHandler(async (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  const healthy = mongoose.connection.readyState === 1 || env.isTest;

  return res.status(healthy ? 200 : 503).json({
    success: healthy,
    data: {
      status: healthy ? 'ok' : 'degraded',
      uptime: process.uptime(),
      environment: env.nodeEnv,
      database: dbState,
    },
  });
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
