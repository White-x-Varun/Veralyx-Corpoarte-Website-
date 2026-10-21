const TYPE_MAP = {
  'full-time': 'full-time',
  fulltime: 'full-time',
  'part-time': 'part-time',
  parttime: 'part-time',
  contract: 'contract',
  internship: 'internship',
};

export function mapEmploymentType(value) {
  if (!value) return 'full-time';
  const key = String(value).trim().toLowerCase().replace(/\s+/g, '-');
  return TYPE_MAP[key] || 'full-time';
}

export function mapJobStatus(value) {
  if (value === 'open') return 'published';
  if (['draft', 'published', 'closed'].includes(value)) return value;
  return 'draft';
}

export function publicJob(job) {
  if (!job) return null;
  const obj = typeof job.toObject === 'function' ? job.toObject() : { ...job };
  return {
    ...obj,
    type: obj.employmentType,
    status: obj.status === 'published' ? 'open' : obj.status,
  };
}

export function publicTestimonial(item) {
  if (!item) return null;
  const obj = typeof item.toObject === 'function' ? item.toObject() : { ...item };
  return {
    ...obj,
    quote: obj.feedback,
    author: obj.clientName,
    role: obj.designation,
    name: obj.clientName,
    content: obj.feedback,
  };
}

export function publicProject(item) {
  if (!item) return null;
  const obj = typeof item.toObject === 'function' ? item.toObject() : { ...item };
  return obj;
}

export function publicBlog(item) {
  if (!item) return null;
  const obj = typeof item.toObject === 'function' ? item.toObject() : { ...item };
  const author = obj.authorId && typeof obj.authorId === 'object' ? obj.authorId.name : undefined;
  return {
    ...obj,
    author: author || obj.author,
  };
}

export function publicApplication(item) {
  if (!item) return null;
  const obj = typeof item.toObject === 'function' ? item.toObject() : { ...item };
  const job = obj.jobId && typeof obj.jobId === 'object' ? obj.jobId : null;
  return {
    ...obj,
    name: obj.applicantName,
    jobTitle: job?.title,
    job: job ? { _id: job._id, title: job.title, slug: job.slug } : undefined,
  };
}

export function publicEnquiry(item) {
  if (!item) return null;
  const obj = typeof item.toObject === 'function' ? item.toObject() : { ...item };
  return {
    ...obj,
    read: obj.status !== 'new',
  };
}

export function sanitizeSettings(settings) {
  if (!settings) return settings;
  const obj = typeof settings.toObject === 'function' ? settings.toObject() : { ...settings };
  delete obj.__v;
  return obj;
}
