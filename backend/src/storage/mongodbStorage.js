import ResumeFile from '../models/ResumeFile.js';

export async function putObject(key, buffer, contentType = 'application/pdf') {
  await ResumeFile.updateOne(
    { _id: key },
    { $set: { data: buffer, contentType } },
    { upsert: true },
  );
  return { key, provider: 'mongodb' };
}

export async function getObject(key) {
  const file = await ResumeFile.findById(key).select('data').lean();
  return file?.data ? Buffer.from(file.data) : null;
}

export async function deleteObject(key) {
  await ResumeFile.deleteOne({ _id: key });
}

export default { putObject, getObject, deleteObject };
