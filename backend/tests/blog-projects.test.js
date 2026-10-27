import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app, createAdmin, TEST_ADMIN, agent, createPost, createProject } from './helpers.js';
import User from '../src/models/User.js';

describe('blog and projects', () => {
  let adminAgent;
  let admin;

  beforeEach(async () => {
    admin = await createAdmin();
    adminAgent = agent();
    await adminAgent.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
  });

  it('hides draft blog posts from the public API', async () => {
    await createPost(admin._id, { slug: 'draft-post', status: 'draft', title: 'Draft' });
    await createPost(admin._id, { slug: 'live-post', status: 'published', title: 'Live' });
    const list = await request(app).get('/api/v1/blog');
    expect(list.body.posts.map((p) => p.slug)).toEqual(['live-post']);
    const draft = await request(app).get('/api/v1/blog/draft-post');
    expect(draft.status).toBe(404);
  });

  it('lets admins publish a blog post', async () => {
    const created = await adminAgent.post('/api/v1/admin/blog').send({
      title: 'Delivery practices',
      content: 'A published article about delivery practices and quality.',
      status: 'draft',
    });
    expect(created.status).toBe(201);
    const id = created.body.data._id;
    const published = await adminAgent.put(`/api/v1/admin/blog/${id}`).send({
      title: 'Delivery practices',
      content: 'A published article about delivery practices and quality.',
      status: 'published',
    });
    expect(published.status).toBe(200);
    const publicPost = await request(app).get(`/api/v1/blog/${published.body.data.slug}`);
    expect(publicPost.status).toBe(200);
  });

  it('hides unpublished projects from the public API', async () => {
    await createProject({ slug: 'secret-work', status: 'draft' });
    await createProject({ slug: 'public-work', status: 'published' });
    const res = await request(app).get('/api/v1/projects');
    expect(res.body.projects.map((p) => p.slug)).toEqual(['public-work']);
  });

  it('supports project CRUD for admins', async () => {
    const created = await adminAgent.post('/api/v1/admin/projects').send({
      title: 'Placeholder case study',
      description: 'Internal sample project. Not a real client outcome.',
      technologies: 'React, Node.js',
      status: 'published',
    });
    expect(created.status).toBe(201);
    const id = created.body.data._id;
    const updated = await adminAgent.put(`/api/v1/admin/projects/${id}`).send({
      title: 'Placeholder case study',
      description: 'Updated description for the sample project case study.',
      technologies: 'React',
      featured: true,
      status: 'published',
    });
    expect(updated.status).toBe(200);
    expect(updated.body.data.featured).toBe(true);
  });

  it('does not expose password hashes on user documents used as authors', async () => {
    const user = await User.findById(admin._id).lean();
    expect(user.passwordHash).toBeUndefined();
  });
});
