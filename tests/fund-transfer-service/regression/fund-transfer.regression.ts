import { test, expect } from '@playwright/test';

test.describe('Fund Transfer Service - Regression', () => {
  test('should handle multiple transfer creations without failure', async ({ request, baseURL }) => {
    const payloads = [
      { fromAccount: '1000000101', toAccount: '1000000102', amount: 50, authID: 'reg-1' },
      { fromAccount: '1000000103', toAccount: '1000000104', amount: 75, authID: 'reg-2' },
      { fromAccount: '1000000105', toAccount: '1000000106', amount: 125, authID: 'reg-3' },
    ];

    for (const payload of payloads) {
      const response = await request.post(`${baseURL}/api/v1/transfer`, { data: payload });
      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body.message).toBe('Success');
      expect(body.transactionId).toBeTruthy();
    }
  });

  test('GET should support pagination params', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/v1/transfer?page=0&size=5`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeLessThanOrEqual(5);
  });

  test('service should remain responsive after transfer creation', async ({ request, baseURL }) => {
    const createResponse = await request.post(`${baseURL}/api/v1/transfer`, {
      data: {
        fromAccount: '1000000201',
        toAccount: '1000000202',
        amount: 500,
        authID: 'reg-stability'
      }
    });

    expect(createResponse.ok()).toBeTruthy();

    const healthLikeResponse = await request.get(`${baseURL}/api/v1/transfer?page=0&size=1`);
    expect(healthLikeResponse.ok()).toBeTruthy();
  });
});
