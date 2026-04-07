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

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        transactionId: expect.any(String),
      })
    );

    expect(body.message).toBe('Success');
  });

  test('GET /api/v1/transfer should return array contract', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/v1/transfer?page=0&size=10`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();

    if (body.length > 0) {
      expect(body[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          fromAccount: expect.any(String),
          toAccount: expect.any(String),
          amount: expect.any(Number),
          status: expect.any(String),
        })
      );
    }
  });
});
