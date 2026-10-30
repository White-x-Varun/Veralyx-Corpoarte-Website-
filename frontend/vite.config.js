import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function validateCloudflareBuild(env) {
  const apiBaseUrl = env.VITE_API_BASE_URL;
  const siteUrl = env.VITE_SITE_URL;

  if (!apiBaseUrl || !siteUrl) {
    throw new Error('Cloudflare Pages builds require VITE_API_BASE_URL and VITE_SITE_URL.');
  }

  let publicSiteUrl;
  try {
    publicSiteUrl = new URL(siteUrl);
  } catch {
    throw new Error('VITE_SITE_URL must be a valid absolute HTTPS URL.');
  }

  if (publicSiteUrl.protocol !== 'https:') {
    throw new Error('Cloudflare Pages site URL must use HTTPS.');
  }
  if (publicSiteUrl.hostname === 'localhost' || publicSiteUrl.hostname === '127.0.0.1') {
    throw new Error('VITE_SITE_URL cannot point to localhost on Cloudflare Pages.');
  }

  // Same-origin API requests are routed by the Pages Function service binding.
  if (apiBaseUrl.startsWith('/')) {
    if (apiBaseUrl.replace(/\/+$/, '') !== '/api/v1') {
      throw new Error('A relative VITE_API_BASE_URL must be /api/v1.');
    }
    return;
  }

  let apiUrl;
  try {
    apiUrl = new URL(apiBaseUrl);
  } catch {
    throw new Error('VITE_API_BASE_URL must be /api/v1 or a valid absolute HTTPS URL.');
  }
  if (apiUrl.protocol !== 'https:') {
    throw new Error('Cloudflare Pages API URL must use HTTPS.');
  }
  if (apiUrl.hostname === 'localhost' || apiUrl.hostname === '127.0.0.1') {
    throw new Error('VITE_API_BASE_URL cannot point to localhost on Cloudflare Pages.');
  }
  if (!apiUrl.pathname.replace(/\/+$/, '').endsWith('/api/v1')) {
    throw new Error('VITE_API_BASE_URL must end with /api/v1.');
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (process.env.CF_PAGES === '1') {
    validateCloudflareBuild(env);
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    server: {
      port: 5173,
      open: false,
    },
  };
});
