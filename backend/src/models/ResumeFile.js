import mongoose from 'mongoose';

const resumeFileSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    data: { type: Buffer, required: true, select: false },
    contentType: { type: String, default: 'application/pdf' },
  },
  { versionKey: false, collection: 'resume_files' },
);

const ResumeFile = mongoose.models.ResumeFile || mongoose.model('ResumeFile', resumeFileSchema);

export default ResumeFile;
