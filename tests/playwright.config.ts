import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /.*\.(spec|test|contract|journey|regression|integration)\.ts/,
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8092',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'config-server-api-contract',
      testDir: './config-server/api-contract',
    },
    {
      name: 'config-server-regression',
      testDir: './config-server/regression',
    },
    {
      name: 'config-server-integration',
      testDir: './config-server/integration',
    },

    {
      name: 'core-banking-user-journey',
      testDir: './core-banking/user-journey',
    },
    {
      name: 'core-banking-api-contract',
      testDir: './core-banking/api-contract',
    },
    {
      name: 'core-banking-regression',
      testDir: './core-banking/regression',
    },
    {
      name: 'core-banking-integration',
      testDir: './core-banking/integration',
    },

    {
      name: 'user-service-api-contract',
      testDir: './user-service/api-contract',
    },
    {
      name: 'user-service-regression',
      testDir: './user-service/regression',
    },
    {
      name: 'user-service-integration',
      testDir: './user-service/integration',
    },

    {
      name: 'fund-transfer-service-user-journey',
      testDir: './fund-transfer-service/user-journey',
    },
    {
      name: 'fund-transfer-service-api-contract',
      testDir: './fund-transfer-service/api-contract',
    },
    {
      name: 'fund-transfer-service-regression',
      testDir: './fund-transfer-service/regression',
    },
    {
      name: 'fund-transfer-service-integration',
      testDir: './fund-transfer-service/integration',
    },

    {
      name: 'utility-payment-service-user-journey',
      testDir: './utility-payment-service/user-journey',
    },
    {
      name: 'utility-payment-service-api-contract',
      testDir: './utility-payment-service/api-contract',
    },
    {
      name: 'utility-payment-service-regression',
      testDir: './utility-payment-service/regression',
    },
    {
      name: 'utility-payment-service-integration',
      testDir: './utility-payment-service/integration',
    },

    {
      name: 'api-gateway-api-contract',
      testDir: './api-gateway/api-contract',
    },
    {
      name: 'api-gateway-regression',
      testDir: './api-gateway/regression',
    },
    {
      name: 'api-gateway-integration',
      testDir: './api-gateway/integration',
    },
  ],
});
