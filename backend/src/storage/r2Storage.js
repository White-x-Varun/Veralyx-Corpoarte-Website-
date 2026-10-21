import env from '../config/env.js';

function workerBucket() {
  return globalThis.__VERALYX_RESUME_BUCKET || null;
}

async function awsStorage() {
  if (!env.r2.endpoint || !env.r2.accessKeyId || !env.r2.secretAccessKey || !env.r2.bucket) {
    throw new Error('R2 storage is not fully configured');
  }
  const { S3Client } = await import('@aws-sdk/client-s3');
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
  const bucket = workerBucket();
  if (bucket) {
    await bucket.put(key, buffer, { httpMetadata: { contentType } });
    return { key, provider: 'r2' };
  }

  const [{ PutObjectCommand }, s3] = await Promise.all([
    import('@aws-sdk/client-s3'),
    awsStorage(),
  ]);
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
  const bucket = workerBucket();
  if (bucket) {
    const object = await bucket.get(key);
    return object ? Buffer.from(await object.arrayBuffer()) : null;
  }

  const [{ GetObjectCommand }, s3] = await Promise.all([
    import('@aws-sdk/client-s3'),
    awsStorage(),
  ]);
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
  const bucket = workerBucket();
  if (bucket) {
    await bucket.delete(key);
    return;
  }

  const [{ DeleteObjectCommand }, s3] = await Promise.all([
    import('@aws-sdk/client-s3'),
    awsStorage(),
  ]);
  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
    }),
  );
}

export async function getDownloadUrl(key, expiresIn = 120) {
  if (workerBucket()) return null;

  const [{ GetObjectCommand }, { getSignedUrl }, s3] = await Promise.all([
    import('@aws-sdk/client-s3'),
    import('@aws-sdk/s3-request-presigner'),
    awsStorage(),
  ]);
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
