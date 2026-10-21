import BlogPost from '../models/BlogPost.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createSlug, ensureUniqueSlug } from '../utils/slug.js';
import { assertObjectId } from '../utils/objectId.js';
import { parsePagination, escapeRegex } from '../utils/pagination.js';
import { publicBlog } from '../services/mappers.js';

export const listPublicPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { status: 'published' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    const q = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ title: q }, { excerpt: q }, { content: q }, { tags: q }];
  }
  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .populate('authorId', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BlogPost.countDocuments(filter),
  ]);
  const posts = items.map(publicBlog);
  return res.status(200).json({
    success: true,
    data: { items: posts, posts, pagination: { page, limit, total } },
    posts,
  });
});

export const getPublicPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' }).populate(
    'authorId',
    'name',
  );
  if (!post) throw ApiError.notFound('Post not found');
  const related = await BlogPost.find({
    status: 'published',
    _id: { $ne: post._id },
    $or: [{ category: post.category }, { tags: { $in: post.tags } }],
  })
    .limit(3)
    .select('title slug excerpt category publishedAt');
  const mapped = publicBlog(post);
  return res.status(200).json({
    success: true,
    data: { ...mapped, related },
    post: { ...mapped, related },
  });
});

export const listAdminPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 100 });
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const q = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ title: q }, { category: q }];
  }
  const [items, total] = await Promise.all([
    BlogPost.find(filter).populate('authorId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
    BlogPost.countDocuments(filter),
  ]);
  const posts = items.map(publicBlog);
  return res.status(200).json({
    success: true,
    data: { items: posts, posts, pagination: { page, limit, total } },
    posts,
  });
});

export const getAdminPost = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const post = await BlogPost.findById(req.params.id).populate('authorId', 'name');
  if (!post) throw ApiError.notFound('Post not found');
  const mapped = publicBlog(post);
  return res.status(200).json({ success: true, data: mapped, post: mapped });
});

export const createPost = asyncHandler(async (req, res) => {
  const slug = await ensureUniqueSlug(BlogPost, createSlug(req.body.slug || req.body.title));
  const status = req.body.status || 'draft';
  const post = await BlogPost.create({
    ...req.body,
    slug,
    authorId: req.user._id,
    publishedAt: status === 'published' ? new Date() : undefined,
  });
  return ApiResponse.created(res, publicBlog(post), 'Post created');
});

export const updatePost = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const existing = await BlogPost.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Post not found');
  const updates = { ...req.body };
  if (req.body.slug && req.body.slug !== existing.slug) {
    updates.slug = await ensureUniqueSlug(BlogPost, createSlug(req.body.slug), existing._id);
  }
  if (req.body.status === 'published' && existing.status !== 'published') {
    updates.publishedAt = existing.publishedAt || new Date();
  }
  Object.assign(existing, updates);
  await existing.save();
  return ApiResponse.success(res, publicBlog(existing), 'Post updated');
});

export const deletePost = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');
  return ApiResponse.success(res, null, 'Post deleted');
});
