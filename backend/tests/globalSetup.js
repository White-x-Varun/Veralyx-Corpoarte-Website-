import path from 'path';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';

const downloadDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.mongo-memory');

export default async function globalSetup() {
  const mongo = await MongoMemoryServer.create({
    binary: { downloadDir },
  });
  process.env.MONGODB_URI = mongo.getUri();

  return async () => {
    await mongo.stop();
  };
}
