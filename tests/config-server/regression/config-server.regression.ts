import { test, expect } from '@playwright/test';

test.describe('Config Server - Regression Tests', () => {

  test('Liveness endpoint should respond', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/actuator/health/liveness`);
    expect([200, 404]).toContain(response.status());
  });

  test('Readiness endpoint should respond', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/actuator/health/readiness`);
    expect([200, 404]).toContain(response.status());
  });

  test('Actuator base endpoint should not fail', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/actuator`);
    expect(response.status()).toBeLessThan(500);
  });

});
