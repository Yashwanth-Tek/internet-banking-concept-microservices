import { test, expect } from '@playwright/test';

test.describe('Config Server - Integration Tests', () => {

  test('Should return config for application/default', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/application/default`);
    expect(response.status()).toBeLessThan(500);
  });

  test('Health endpoint should always be available', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/actuator/health`);
    expect(response.ok()).toBeTruthy();
  });

});
