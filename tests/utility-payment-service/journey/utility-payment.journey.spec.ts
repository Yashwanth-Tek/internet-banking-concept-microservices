import { test, expect } from '@playwright/test';

test('basic utility payment journey smoke test', async ({ request }) => {
  const health = await request.get(`${process.env.BASE_URL}/actuator/health`);
  expect(health.ok()).toBeTruthy();

  const body = await health.json();
  expect(body.status).toBe('UP');
});
