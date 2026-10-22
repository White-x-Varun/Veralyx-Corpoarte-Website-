import { v4 as uuidv4 } from 'uuid';
import env from '../config/env.js';
import * as local from './localStorage.js';
import * as mongodb from './mongodbStorage.js';
import * as r2 from './r2Storage.js';

function provider() {
  if (env.storageProvider === 'r2') return r2;
  if (env.storageProvider === 'mongodb') return mongodb;
  return local;
}

export function createResumeKey() {
  const id = uuidv4();
  return `resumes/${id}.pdf`;
}

export async function putObject(key, buffer, contentType) {
  return provider().putObject(key, buffer, contentType);
}

export async function getObject(key) {
  return provider().getObject(key);
}

export async function deleteObject(key) {
  return provider().deleteObject(key);
}

export async function getDownloadUrl(key, expiresIn = 120) {
  const impl = provider();
  if (typeof impl.getDownloadUrl === 'function') {
    return impl.getDownloadUrl(key, expiresIn);
  }
  return null;
}

export default {
  createResumeKey,
  putObject,
  getObject,
  deleteObject,
  getDownloadUrl,
};
