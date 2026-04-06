import { test, expect } from '@playwright/test';

test.describe('User Service - Authentication & Authorization', () => {
  test('profile endpoint should reject unauthenticated request', async ({ request }) => {
    const response = await request.get('/api/users/profile');
    expect([401, 403]).toContain(response.status());
  });

  test('login should fail with invalid credentials', async ({ request }) => {
    const response = await request.post('/api/users/login', {
      data: {
        username: 'wrongUser',
        password: 'wrongPassword'
      }
    });

    expect([400, 401, 403]).toContain(response.status());
  });

  test('protected endpoint should reject invalid token', async ({ request }) => {
    const response = await request.get('/api/users/profile', {
      headers: {
        Authorization: 'Bearer invalid-token'
      }
    });

    expect([401, 403]).toContain(response.status());
  });
});
