<<<<<<< HEAD
import mongoose from 'mongoose';
import ApiError from './ApiError.js';

export function assertObjectId(id, label = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${label}`);
  }
  return id;
}
=======
import mongoose from 'mongoose';
import ApiError from './ApiError.js';

export function assertObjectId(id, label = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${label}`);
  }
  return id;
}
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
