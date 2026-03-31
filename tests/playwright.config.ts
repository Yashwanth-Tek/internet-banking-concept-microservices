import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /.*\.(spec|test|contract|journey)\.ts/,
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['junit', { outputFile: 'results/junit.xml' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8092',
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  },
  projects: [
    { name: 'user-journey', testDir: './user-journey' },
    { name: 'api-contract', testDir: './api-contract' },
    { name: 'regression', testDir: './regression' },
    { name: 'integration', testDir: './integration' },
  ],
});
