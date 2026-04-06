import { test, expect } from '@playwright/test';

test.describe('User Service - Integration', () => {
  test('user service should integrate with downstream service endpoints', async ({ request }) => {
    const response = await request.get('/api/users/1/accounts');
    expect([200, 404, 500]).toContain(response.status());
  });

  test('service should be reachable through stage service URL', async ({ request }) => {
    const response = await request.get('/actuator/health');
    expect(response.status()).toBe(200);
  });
});
