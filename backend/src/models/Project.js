import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    summary: { type: String, trim: true, default: '', maxlength: 500 },
    content: { type: String, default: '' },
    category: { type: String, trim: true, default: '' },
    client: { type: String, trim: true, default: '' },
    technologies: [{ type: String, trim: true }],
    imageUrls: [{ type: String, trim: true }],
    liveUrl: { type: String, trim: true, default: '' },
    demoUrl: { type: String, trim: true, default: '' },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
  },
  { timestamps: true },
);

projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ status: 1, featured: -1, createdAt: -1 });
projectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

const Project = mongoose.model('Project', projectSchema);

export default Project;
