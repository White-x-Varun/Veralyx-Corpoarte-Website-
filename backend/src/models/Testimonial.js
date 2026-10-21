import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 120 },
    designation: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    feedback: { type: String, required: true, maxlength: 2000 },
    imageUrl: { type: String, trim: true, default: '' },
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

testimonialSchema.index({ approved: 1, createdAt: -1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
