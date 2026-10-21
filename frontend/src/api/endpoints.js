const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const endpoints = {
  // Auth
  authLogin: `${API_BASE}/auth/login`,
  authLogout: `${API_BASE}/auth/logout`,
  authMe: `${API_BASE}/auth/me`,
  authCsrf: `${API_BASE}/auth/csrf`,

  // Public
  settings: `${API_BASE}/settings`,
  contact: `${API_BASE}/contact`,
  projects: `${API_BASE}/projects`,
  project: (slug) => `${API_BASE}/projects/${slug}`,
  jobs: `${API_BASE}/jobs`,
  job: (slug) => `${API_BASE}/jobs/${slug}`,
  jobApply: (slug) => `${API_BASE}/jobs/${slug}/apply`,
  blog: `${API_BASE}/blog`,
  blogPost: (slug) => `${API_BASE}/blog/${slug}`,
  testimonials: `${API_BASE}/testimonials`,

  // Admin
  adminJobs: `${API_BASE}/admin/jobs`,
  adminJob: (id) => `${API_BASE}/admin/jobs/${id}`,
  adminApplications: `${API_BASE}/admin/applications`,
  adminApplication: (id) => `${API_BASE}/admin/applications/${id}`,
  adminApplicationResume: (id) => `${API_BASE}/admin/applications/${id}/resume`,
  adminEnquiries: `${API_BASE}/admin/enquiries`,
  adminEnquiry: (id) => `${API_BASE}/admin/enquiries/${id}`,
  adminBlog: `${API_BASE}/admin/blog`,
  adminBlogPost: (id) => `${API_BASE}/admin/blog/${id}`,
  adminProjects: `${API_BASE}/admin/projects`,
  adminProject: (id) => `${API_BASE}/admin/projects/${id}`,
  adminTestimonials: `${API_BASE}/admin/testimonials`,
  adminTestimonial: (id) => `${API_BASE}/admin/testimonials/${id}`,
  adminSettings: `${API_BASE}/admin/settings`,
  adminProfile: `${API_BASE}/admin/profile`,
  adminDashboard: `${API_BASE}/admin/dashboard`,
};

export default endpoints;
