import { test, expect } from '@playwright/test';

test.describe('Fund Transfer Service - Integration', () => {
  test('created transfer should be persisted and visible via GET endpoint', async ({ request, baseURL }) => {
    const uniqueFrom = `200${Date.now()}`;
    const uniqueTo = `300${Date.now()}`;
    const uniqueAmount = 999.99;

    const createResponse = await request.post(`${baseURL}/api/v1/transfer`, {
      data: {
        fromAccount: uniqueFrom,
        toAccount: uniqueTo,
        amount: uniqueAmount,
        authID: 'integration-user'
      }
    });

    expect(createResponse.ok()).toBeTruthy();

    const getResponse = await request.get(`${baseURL}/api/v1/transfer?page=0&size=50`);
    expect(getResponse.ok()).toBeTruthy();

    const transfers = await getResponse.json();
    expect(Array.isArray(transfers)).toBeTruthy();

    const found = transfers.find((t: any) =>
      t.fromAccount === uniqueFrom &&
      t.toAccount === uniqueTo &&
      Number(t.amount) === uniqueAmount
    );

    expect(found).toBeTruthy();
    expect(found.status).toBeTruthy();
  });
});
