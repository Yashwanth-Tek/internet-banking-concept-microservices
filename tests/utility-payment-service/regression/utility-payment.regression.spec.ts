import { test, expect } from '@playwright/test';

test('utility payment actuator health remains stable', async ({ request }) => {
  for (let i = 0; i < 3; i++) {
    const response = await request.get(`${process.env.BASE_URL}/actuator/health`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('UP');
  }
});
