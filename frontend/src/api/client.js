import axios from 'axios';
import { endpoints } from './endpoints';

const client = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfToken = null;
let csrfPromise = null;

export async function fetchCsrfToken() {
  if (csrfToken) return csrfToken;
  if (csrfPromise) return csrfPromise;

  csrfPromise = client
    .get(endpoints.authCsrf)
    .then((res) => {
      csrfToken = res.data?.csrfToken || res.data?.token || res.headers['x-csrf-token'];
      return csrfToken;
    })
    .catch(() => {
      csrfToken = null;
      return null;
    })
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
}

export function clearCsrfToken() {
  csrfToken = null;
}

client.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await fetchCsrfToken();
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      clearCsrfToken();
    }
    return Promise.reject(error);
  },
);

export default client;
