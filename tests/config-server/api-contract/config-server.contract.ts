import { test, expect } from '@playwright/test';

test.describe('Config Server - API Contract Tests', () => {

  test('Health endpoint should return UP', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/actuator/health`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('UP');
  });

  test('Actuator env endpoint should be accessible', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/actuator/env`);
    expect(response.status()).toBeLessThan(500);
  });

});
