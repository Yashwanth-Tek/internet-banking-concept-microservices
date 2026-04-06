import { test, expect } from '@playwright/test';

test.describe('User Service - User Journey', () => {
  test('register -> login -> get profile', async ({ request }) => {
    const uniqueUser = `user_${Date.now()}`;

    const registerResponse = await request.post('/api/users/register', {
      data: {
        username: uniqueUser,
        password: 'Password@123',
        email: `${uniqueUser}@test.com`
      }
    });

    expect([200, 201]).toContain(registerResponse.status());

    const loginResponse = await request.post('/api/users/login', {
      data: {
        username: uniqueUser,
        password: 'Password@123'
      }
    });

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    expect(loginBody.token).toBeTruthy();

    const profileResponse = await request.get('/api/users/profile', {
      headers: {
        Authorization: `Bearer ${loginBody.token}`
      }
    });

    expect(profileResponse.status()).toBe(200);
  });
});
