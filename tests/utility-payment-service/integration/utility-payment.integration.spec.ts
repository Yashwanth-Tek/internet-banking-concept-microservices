import { test, expect } from '@playwright/test';

test('utility payment service is reachable', async ({ request }) => {
  const response = await request.get(`${process.env.BASE_URL}/actuator/health`);
  expect(response.status()).toBe(200);
});
