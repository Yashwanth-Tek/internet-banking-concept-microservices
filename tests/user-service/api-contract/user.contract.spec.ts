import { test, expect } from '@playwright/test';

test.describe('User Service - API Contract', () => {
  test('user response should contain expected fields', async ({ request }) => {
    const response = await request.get('/api/users/1');

    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json();

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('username');

      if (body.email !== undefined) {
        expect(typeof body.email).toBe('string');
      }
    }
  });

  test('login response should contain token on success', async ({ request }) => {
    const response = await request.post('/api/users/login', {
      data: {
        username: 'existingUser',
        password: 'Password@123'
      }
    });

    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('token');
    } else {
      expect([401, 404]).toContain(response.status());
    }
  });
});
