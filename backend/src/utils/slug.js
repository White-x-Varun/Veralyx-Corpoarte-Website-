import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export function createSlug(text) {
  const base = slugify(text, { lower: true, strict: true, trim: true });
  return base || uuidv4().slice(0, 8);
}

export async function ensureUniqueSlug(Model, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}
