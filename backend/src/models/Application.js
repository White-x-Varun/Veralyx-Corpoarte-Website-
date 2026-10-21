import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    applicantName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    education: { type: String, trim: true, default: '' },
    coverLetter: { type: String, trim: true, default: '', maxlength: 8000 },
    resumeKey: { type: String, required: true },
    resumeOriginalName: { type: String, default: '' },
    resumeMimeType: { type: String, default: 'application/pdf' },
    resumeSize: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'new',
      index: true,
    },
    adminNotes: { type: String, default: '', select: false },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, email: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

applicationSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject();
  delete obj.adminNotes;
  return obj;
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;
