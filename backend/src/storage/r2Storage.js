import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../config/env.js';

function client() {
  if (!env.r2.endpoint || !env.r2.accessKeyId || !env.r2.secretAccessKey || !env.r2.bucket) {
    throw new Error('R2 storage is not fully configured');
  }
  return new S3Client({
    region: 'auto',
    endpoint: env.r2.endpoint,
    credentials: {
      accessKeyId: env.r2.accessKeyId,
      secretAccessKey: env.r2.secretAccessKey,
    },
  });
}

export async function putObject(key, buffer, contentType = 'application/pdf') {
  const s3 = client();
  await s3.send(
    new PutObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  return { key, provider: 'r2' };
}

export async function getObject(key) {
  const s3 = client();
  const result = await s3.send(
    new GetObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
    }),
  );
  const chunks = [];
  for await (const chunk of result.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function deleteObject(key) {
  const s3 = client();
  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
    }),
  );
}

export async function getDownloadUrl(key, expiresIn = 120) {
  const s3 = client();
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
    }),
    { expiresIn },
  );
}

export default { putObject, getObject, deleteObject, getDownloadUrl };
