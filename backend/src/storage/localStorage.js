import fs from 'fs/promises';
import path from 'path';
import env from '../config/env.js';

function resolveUploadDir() {
  return path.resolve(env.localUploadDir);
}

function safeJoin(key) {
  const base = resolveUploadDir();
  const target = path.resolve(base, key);
  if (!target.startsWith(base)) {
    throw new Error('Invalid storage key');
  }
  return target;
}

export async function putObject(key, buffer) {
  const filePath = safeJoin(key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  return { key, provider: 'local' };
}

export async function getObject(key) {
  const filePath = safeJoin(key);
  return fs.readFile(filePath);
}

export async function deleteObject(key) {
  try {
    await fs.unlink(safeJoin(key));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

export async function exists(key) {
  try {
    await fs.access(safeJoin(key));
    return true;
  } catch {
    return false;
  }
}

export default { putObject, getObject, deleteObject, exists };
