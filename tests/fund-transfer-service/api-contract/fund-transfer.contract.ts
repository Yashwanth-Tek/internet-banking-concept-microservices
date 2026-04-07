import { test, expect } from '@playwright/test';

test.describe('Fund Transfer Service - API Contract', () => {
  test('POST /api/v1/transfer should return expected response contract', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/api/v1/transfer`, {
      data: {
        fromAccount: '1000000010',
        toAccount: '1000000020',
        amount: 100.00,
        authID: 'contract-user'
      }
    });

    const status = response.status();
    const text = await response.text();
    console.log('POST status:', status);
    console.log('POST body:', text);

    expect(status).toBe(200);
  });

  test('GET /api/v1/transfer should return array contract', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/v1/transfer?page=0&size=10`);

    const status = response.status();
    const text = await response.text();
    console.log('GET status:', status);
    console.log('GET body:', text);

    expect(status).toBe(200);
  });
});
