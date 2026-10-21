import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, createAdmin, TEST_ADMIN, agent } from './helpers.js';
import ContactEnquiry from '../src/models/ContactEnquiry.js';

const valid = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  company: 'Example Co',
  inquiryType: 'project',
  subject: 'Project discussion',
  message: 'We would like to discuss a software engagement with your team.',
};

describe('contact enquiries', () => {
  it('accepts a valid submission', async () => {
    const res = await request(app).post('/api/v1/contact').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const stored = await ContactEnquiry.findOne({ email: valid.email });
    expect(stored).toBeTruthy();
    expect(stored.message).toBe(valid.message);
  });

  it('rejects invalid submissions', async () => {
    const res = await request(app).post('/api/v1/contact').send({
      name: 'A',
      email: 'not-an-email',
      message: 'short',
    });
    expect(res.status).toBe(400);
    expect(await ContactEnquiry.countDocuments()).toBe(0);
  });

  it('does not persist honeypot spam', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({ ...valid, website: 'https://spam.example' });
    expect(res.status).toBe(201);
    expect(await ContactEnquiry.countDocuments()).toBe(0);
  });

  it('hides enquiries from the public API', async () => {
    await request(app).post('/api/v1/contact').send(valid);
    const res = await request(app).get('/api/v1/admin/enquiries');
    expect(res.status).toBe(401);
  });

  it('lets admins list submitted enquiries', async () => {
    await createAdmin();
    await request(app).post('/api/v1/contact').send(valid);
    const auth = agent();
    await auth.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const res = await auth.get('/api/v1/admin/enquiries');
    expect(res.status).toBe(200);
    expect(res.body.enquiries).toHaveLength(1);
    expect(res.body.enquiries[0].email).toBe(valid.email);
  });
});
