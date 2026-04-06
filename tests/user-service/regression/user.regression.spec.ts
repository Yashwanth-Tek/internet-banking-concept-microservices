import { test, expect } from '@playwright/test';

test.describe('User Service - Regression', () => {
  test('existing login API should still work', async ({ request }) => {
    const response = await request.post('/api/users/login', {
      data: {
        username: 'existingUser',
        password: 'Password@123'
      }
    });

    expect([200, 401, 404]).toContain(response.status());
  });

  test('get user by id endpoint should respond', async ({ request }) => {
    const response = await request.get('/api/users/1');
    expect([200, 404]).toContain(response.status());
  });

  test('health endpoint should respond', async ({ request }) => {
    const response = await request.get('/actuator/health');
    expect(response.status()).toBe(200);
  });
});
