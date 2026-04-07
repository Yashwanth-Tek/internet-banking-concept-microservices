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

    const createStatus = createResponse.status();
    const createText = await createResponse.text();

    console.log('CREATE STATUS:', createStatus);
    console.log('CREATE BODY:', createText);

    expect(createStatus).toBe(200);

    const createBody = JSON.parse(createText);
    expect(createBody).toHaveProperty('message');
    expect(createBody.message).toBe('Success');
    expect(createBody).toHaveProperty('transactionId');

    const listResponse = await request.get(`${baseURL}/api/v1/transfer?page=0&size=20`);

    const listStatus = listResponse.status();
    const listText = await listResponse.text();

    console.log('LIST STATUS:', listStatus);
    console.log('LIST BODY:', listText);

    expect(listStatus).toBe(200);

    const listBody = JSON.parse(listText);
    expect(Array.isArray(listBody)).toBeTruthy();

    const matchingTransfer = listBody.find((item: any) =>
      item.fromAccount === transferPayload.fromAccount &&
      item.toAccount === transferPayload.toAccount &&
      Number(item.amount) === transferPayload.amount
    );

    expect(matchingTransfer).toBeTruthy();
  });
});
