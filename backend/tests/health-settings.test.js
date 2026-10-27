import { describe, it, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, createAdmin, TEST_ADMIN, agent, seedSettings } from './helpers.js';

describe('health and settings', () => {
  it('returns health without secrets', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
    expect(JSON.stringify(res.body)).not.toMatch(/password|secret|mongodb:\/\//i);
  });

  it('returns public settings with placeholders', async () => {
    await seedSettings();
    const res = await request(app).get('/api/v1/settings');
    expect(res.status).toBe(200);
    expect(res.body.companyName).toBe('Veralyx');
    expect(res.body.email).toBe('veralyx91@gmail.com');
  });

  it('updates settings as admin', async () => {
    await createAdmin();
    const auth = agent();
    await auth.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const res = await auth.put('/api/v1/admin/settings').send({
      companyName: 'VERALYX Labs',
      whatsappNumber: '15550100',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.companyName).toBe('VERALYX Labs');
  });

  it('handles missing records', async () => {
    await createAdmin();
    const auth = agent();
    await auth.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const missingId = new mongoose.Types.ObjectId();
    const res = await auth.get(`/api/v1/admin/jobs/${missingId}`);
    expect(res.status).toBe(404);
  });
});
