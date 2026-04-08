import { test, expect } from '@playwright/test';

test('utility payment actuator contract is valid', async ({ request }) => {
  const response = await request.get(`${process.env.BASE_URL}/actuator/health`);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body).toHaveProperty('status');
  expect(typeof body.status).toBe('string');
});
