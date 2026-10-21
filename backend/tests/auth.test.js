<<<<<<< HEAD
import { describe, it, expect, beforeEach } from 'vitest';
import { app, createAdmin, TEST_ADMIN, agent } from './helpers.js';
import request from 'supertest';

describe('authentication', () => {
  beforeEach(async () => {
    await createAdmin();
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(TEST_ADMIN.email);
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie']?.some((c) => c.startsWith('veralyx_session='))).toBe(true);
  });

  it('rejects invalid credentials without leaking which field failed', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: 'wrong-password',
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('rejects unauthenticated admin access', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard');
    expect(res.status).toBe(401);
  });

  it('returns the current user after login', async () => {
    const auth = agent();
    await auth.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const me = await auth.get('/api/v1/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(TEST_ADMIN.email);
  });

  it('invalidates the session on logout', async () => {
    const auth = agent();
    await auth.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const out = await auth.post('/api/v1/auth/logout');
    expect(out.status).toBe(200);
    const me = await auth.get('/api/v1/auth/me');
    expect(me.status).toBe(401);
  });
});
=======
import { describe, it, expect, beforeEach } from 'vitest';
import { app, createAdmin, TEST_ADMIN, agent } from './helpers.js';
import request from 'supertest';

describe('authentication', () => {
  beforeEach(async () => {
    await createAdmin();
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(TEST_ADMIN.email);
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie']?.some((c) => c.startsWith('veralyx_session='))).toBe(true);
  });

  it('rejects invalid credentials without leaking which field failed', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: 'wrong-password',
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('rejects unauthenticated admin access', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard');
    expect(res.status).toBe(401);
  });

  it('returns the current user after login', async () => {
    const auth = agent();
    await auth.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const me = await auth.get('/api/v1/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(TEST_ADMIN.email);
  });

  it('invalidates the session on logout', async () => {
    const auth = agent();
    await auth.post('/api/v1/auth/login').send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const out = await auth.post('/api/v1/auth/logout');
    expect(out.status).toBe(200);
    const me = await auth.get('/api/v1/auth/me');
    expect(me.status).toBe(401);
  });
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
