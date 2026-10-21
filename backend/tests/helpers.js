<<<<<<< HEAD
import request from 'supertest';
import { createApp } from '../src/app.js';
import User from '../src/models/User.js';
import Job from '../src/models/Job.js';
import BlogPost from '../src/models/BlogPost.js';
import Project from '../src/models/Project.js';
import SiteSettings from '../src/models/SiteSettings.js';

export const app = createApp();

export const TEST_ADMIN = {
  email: 'admin@example.com',
  password: 'TestAdminPass123!',
  name: 'Test Admin',
};

export async function createAdmin(overrides = {}) {
  const passwordHash = await User.hashPassword(overrides.password || TEST_ADMIN.password);
  return User.create({
    name: overrides.name || TEST_ADMIN.name,
    email: (overrides.email || TEST_ADMIN.email).toLowerCase(),
    passwordHash,
    role: 'admin',
  });
}

export async function loginAdmin(agent, creds = TEST_ADMIN) {
  const res = await agent.post('/api/v1/auth/login').send({
    email: creds.email,
    password: creds.password,
  });
  return res;
}

export function agent() {
  return request.agent(app);
}

export async function seedSettings() {
  return SiteSettings.getSingleton();
}

export async function createPublishedJob(overrides = {}) {
  return Job.create({
    title: overrides.title || 'Software Engineer',
    slug: overrides.slug || 'software-engineer',
    description: overrides.description || 'Build and maintain production software systems.',
    responsibilities: ['Write code'],
    requirements: ['JavaScript'],
    skills: ['React', 'Node.js'],
    employmentType: overrides.employmentType || 'full-time',
    workMode: overrides.workMode || 'hybrid',
    location: overrides.location || 'Remote',
    status: overrides.status || 'published',
  });
}

export async function createPost(authorId, overrides = {}) {
  return BlogPost.create({
    title: overrides.title || 'Engineering notes',
    slug: overrides.slug || 'engineering-notes',
    excerpt: 'A short excerpt',
    content: 'Full article content for testing published visibility rules.',
    category: overrides.category || 'Engineering',
    tags: ['engineering'],
    authorId,
    status: overrides.status || 'draft',
    publishedAt: overrides.status === 'published' ? new Date() : undefined,
  });
}

export async function createProject(overrides = {}) {
  return Project.create({
    title: overrides.title || 'Internal platform',
    slug: overrides.slug || 'internal-platform',
    description: 'A sample portfolio project used for tests. Not a real client engagement.',
    technologies: ['React', 'MongoDB'],
    status: overrides.status || 'published',
    featured: Boolean(overrides.featured),
  });
}

export const MIN_PDF = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n');
=======
import request from 'supertest';
import { createApp } from '../src/app.js';
import User from '../src/models/User.js';
import Job from '../src/models/Job.js';
import BlogPost from '../src/models/BlogPost.js';
import Project from '../src/models/Project.js';
import SiteSettings from '../src/models/SiteSettings.js';

export const app = createApp();

export const TEST_ADMIN = {
  email: 'admin@example.com',
  password: 'TestAdminPass123!',
  name: 'Test Admin',
};

export async function createAdmin(overrides = {}) {
  const passwordHash = await User.hashPassword(overrides.password || TEST_ADMIN.password);
  return User.create({
    name: overrides.name || TEST_ADMIN.name,
    email: (overrides.email || TEST_ADMIN.email).toLowerCase(),
    passwordHash,
    role: 'admin',
  });
}

export async function loginAdmin(agent, creds = TEST_ADMIN) {
  const res = await agent.post('/api/v1/auth/login').send({
    email: creds.email,
    password: creds.password,
  });
  return res;
}

export function agent() {
  return request.agent(app);
}

export async function seedSettings() {
  return SiteSettings.getSingleton();
}

export async function createPublishedJob(overrides = {}) {
  return Job.create({
    title: overrides.title || 'Software Engineer',
    slug: overrides.slug || 'software-engineer',
    description: overrides.description || 'Build and maintain production software systems.',
    responsibilities: ['Write code'],
    requirements: ['JavaScript'],
    skills: ['React', 'Node.js'],
    employmentType: overrides.employmentType || 'full-time',
    workMode: overrides.workMode || 'hybrid',
    location: overrides.location || 'Remote',
    status: overrides.status || 'published',
  });
}

export async function createPost(authorId, overrides = {}) {
  return BlogPost.create({
    title: overrides.title || 'Engineering notes',
    slug: overrides.slug || 'engineering-notes',
    excerpt: 'A short excerpt',
    content: 'Full article content for testing published visibility rules.',
    category: overrides.category || 'Engineering',
    tags: ['engineering'],
    authorId,
    status: overrides.status || 'draft',
    publishedAt: overrides.status === 'published' ? new Date() : undefined,
  });
}

export async function createProject(overrides = {}) {
  return Project.create({
    title: overrides.title || 'Internal platform',
    slug: overrides.slug || 'internal-platform',
    description: 'A sample portfolio project used for tests. Not a real client engagement.',
    technologies: ['React', 'MongoDB'],
    status: overrides.status || 'published',
    featured: Boolean(overrides.featured),
  });
}

export const MIN_PDF = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n');
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
