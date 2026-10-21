import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./tests/globalSetup.js'],
    setupFiles: ['./tests/setup.js'],
    fileParallelism: false,
    maxWorkers: 1,
    hookTimeout: 600000,
    testTimeout: 30000,
    env: {
      NODE_ENV: 'test',
      CSRF_ENABLED: 'false',
      SESSION_SECRET: 'test-session-secret-value-32chars',
      CLIENT_ORIGIN: 'http://localhost:5173',
      STORAGE_PROVIDER: 'local',
      LOCAL_UPLOAD_DIR: './uploads-test',
    },
  },
});
