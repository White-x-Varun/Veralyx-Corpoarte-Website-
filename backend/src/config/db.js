import mongoose from 'mongoose';
import env from './env.js';

export async function connectDB(uri = env.mongodbUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export default { connectDB, disconnectDB };
