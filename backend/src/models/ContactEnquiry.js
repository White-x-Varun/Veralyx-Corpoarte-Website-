<<<<<<< HEAD
import mongoose from 'mongoose';

const contactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    subject: { type: String, trim: true, default: '', maxlength: 200 },
    enquiryType: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, maxlength: 5000 },
    consent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true },
);

contactEnquirySchema.index({ status: 1, createdAt: -1 });

const ContactEnquiry = mongoose.model('ContactEnquiry', contactEnquirySchema);

export default ContactEnquiry;
=======
import mongoose from 'mongoose';

const contactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    subject: { type: String, trim: true, default: '', maxlength: 200 },
    enquiryType: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, maxlength: 5000 },
    consent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true },
);

contactEnquirySchema.index({ status: 1, createdAt: -1 });

const ContactEnquiry = mongoose.model('ContactEnquiry', contactEnquirySchema);

export default ContactEnquiry;
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
