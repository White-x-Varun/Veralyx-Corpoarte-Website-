import mongoose from 'mongoose';
import ApiError from './ApiError.js';

export function assertObjectId(id, label = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${label}`);
  }
  return id;
}
