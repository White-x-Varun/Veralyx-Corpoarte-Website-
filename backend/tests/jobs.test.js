import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import {
  app,
  createAdmin,
  TEST_ADMIN,
  agent,
  createPublishedJob,
  MIN_PDF,
} from './helpers.js';
import Application from '../src/models/Application.js';

describe('jobs and applications', () => {
  let adminAgent;

  beforeEach(async () => {
    await createAdmin();
    adminAgent = agent();
    await adminAgent.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
  });

  it('does not list draft jobs publicly', async () => {
    await createPublishedJob({ slug: 'draft-role', status: 'draft', title: 'Draft role' });
    await createPublishedJob({ slug: 'open-role', status: 'published', title: 'Open role' });
    const res = await request(app).get('/api/v1/jobs');
    expect(res.status).toBe(200);
    expect(res.body.jobs.map((j) => j.slug)).toEqual(['open-role']);
  });

  it('returns 404 for a missing job slug', async () => {
    const res = await request(app).get('/api/v1/jobs/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('creates, updates, and deletes jobs as admin', async () => {
    const created = await adminAgent.post('/api/v1/admin/jobs').send({
      title: 'Frontend Engineer',
      description: 'Build accessible product interfaces for our clients.',
      type: 'full-time',
      workMode: 'remote',
      status: 'open',
      location: 'Remote',
    });
    expect(created.status).toBe(201);
    const id = created.body.data._id;
    expect(created.body.data.status).toBe('open');

    const updated = await adminAgent.put(`/api/v1/admin/jobs/${id}`).send({
      title: 'Frontend Engineer',
      description: 'Build accessible product interfaces for our clients.',
      type: 'full-time',
      workMode: 'hybrid',
      status: 'closed',
      location: 'Remote',
    });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('closed');

    const deleted = await adminAgent.delete(`/api/v1/admin/jobs/${id}`);
    expect(deleted.status).toBe(200);
  });

  it('rejects unauthenticated job creation', async () => {
    const res = await request(app).post('/api/v1/admin/jobs').send({
      title: 'Should fail',
      description: 'This must not be created without a session.',
    });
    expect(res.status).toBe(401);
  });

  it('rejects invalid application payloads', async () => {
    await createPublishedJob({ slug: 'apply-role' });
    const res = await request(app).post('/api/v1/jobs/apply-role/apply').send({
      name: 'A',
      email: 'bad',
    });
    expect(res.status).toBe(400);
  });

  it('rejects non-PDF resumes', async () => {
    await createPublishedJob({ slug: 'pdf-role' });
    const res = await request(app)
      .post('/api/v1/jobs/pdf-role/apply')
      .field('name', 'Jordan Lee')
      .field('email', 'jordan@example.com')
      .field('coverLetter', 'I am interested in this role and have relevant experience.')
      .attach('resume', Buffer.from('not a pdf'), {
        filename: 'resume.txt',
        contentType: 'text/plain',
      });
    expect(res.status).toBe(400);
    expect(await Application.countDocuments()).toBe(0);
  });

  it('accepts a valid PDF application', async () => {
    await createPublishedJob({ slug: 'pdf-ok' });
    const res = await request(app)
      .post('/api/v1/jobs/pdf-ok/apply')
      .field('name', 'Jordan Lee')
      .field('email', 'jordan@example.com')
      .field('coverLetter', 'I am interested in this role and have relevant experience.')
      .attach('resume', MIN_PDF, { filename: 'resume.pdf', contentType: 'application/pdf' });
    expect(res.status).toBe(201);
    expect(await Application.countDocuments()).toBe(1);
  });

  it('rejects invalid admin ids', async () => {
    const res = await adminAgent.get('/api/v1/admin/jobs/not-an-id');
    expect(res.status).toBe(400);
  });
});
