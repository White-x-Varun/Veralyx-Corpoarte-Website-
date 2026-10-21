<<<<<<< HEAD
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
    },
    workMode: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid'],
      required: true,
    },
    location: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    summary: { type: String, trim: true, default: '', maxlength: 500 },
    eligibility: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
      index: true,
    },
    applicationDeadline: { type: Date },
  },
  { timestamps: true },
);

jobSchema.index({ slug: 1 }, { unique: true });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
=======
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
    },
    workMode: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid'],
      required: true,
    },
    location: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    summary: { type: String, trim: true, default: '', maxlength: 500 },
    eligibility: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
      index: true,
    },
    applicationDeadline: { type: Date },
  },
  { timestamps: true },
);

jobSchema.index({ slug: 1 }, { unique: true });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
