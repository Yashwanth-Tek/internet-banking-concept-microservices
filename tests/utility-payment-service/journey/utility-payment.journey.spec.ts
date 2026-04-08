import { test, expect } from '@playwright/test';

test('utility payment user journey health check', async ({ request }) => {
  const response = await request.get(`${process.env.BASE_URL}/actuator/health`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.status).toBe('UP');
});
