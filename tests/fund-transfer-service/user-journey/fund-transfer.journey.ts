import { test, expect } from '@playwright/test';

test.describe('Fund Transfer Service - User Journey', () => {
  test('should create a fund transfer and then read transfers list', async ({ request, baseURL }) => {
    const transferPayload = {
      fromAccount: '1000000001',
      toAccount: '1000000002',
      amount: 250.75,
      authID: 'demo-user-1'
    };

    const createResponse = await request.post(`${baseURL}/api/v1/transfer`, {
      data: transferPayload
    });

    expect(createResponse.ok()).toBeTruthy();

    const createBody = await createResponse.json();
    expect(createBody).toHaveProperty('message');
    expect(createBody.message).toBe('Success');
    expect(createBody).toHaveProperty('transactionId');
    expect(typeof createBody.transactionId).toBe('string');
    expect(createBody.transactionId.length).toBeGreaterThan(5);

    const listResponse = await request.get(`${baseURL}/api/v1/transfer?page=0&size=20`);
    expect(listResponse.ok()).toBeTruthy();

    const listBody = await listResponse.json();
    expect(Array.isArray(listBody)).toBeTruthy();

    const matchingTransfer = listBody.find((item: any) =>
      item.fromAccount === transferPayload.fromAccount &&
      item.toAccount === transferPayload.toAccount &&
      Number(item.amount) === transferPayload.amount
    );

    expect(matchingTransfer).toBeTruthy();
  });
});
