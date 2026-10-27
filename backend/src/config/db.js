import mongoose from 'mongoose';
import env from './env.js';

let connectionPromise = null;

export async function connectDB(uri = env.mongodbUri) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  mongoose.set('strictQuery', true);
  connectionPromise = mongoose.connect(uri)
    .then(() => mongoose.connection)
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });
  return connectionPromise;
}

export async function disconnectDB() {
  connectionPromise = null;
  await mongoose.disconnect();
}

export default { connectDB, disconnectDB };
