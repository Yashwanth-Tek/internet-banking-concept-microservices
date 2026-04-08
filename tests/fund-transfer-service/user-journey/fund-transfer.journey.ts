import { test, expect } from '@playwright/test';

function uniqueTransferPayload(prefix: string) {
  const seed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  return {
    fromAccount: `FT-${prefix}-FROM-${seed}`,
    toAccount: `FT-${prefix}-TO-${seed}`,
    amount: 250.75,
    authID: `ft-${prefix}-auth`,
  };
}

function normalizeListBody(body: unknown): any[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object' && Array.isArray((body as any).content)) {
    return (body as any).content;
  }
  throw new Error(`Unsupported list response shape: ${JSON.stringify(body)}`);
}

test.describe('Fund Transfer Service - User Journey', () => {
  test('should create a fund transfer and then read transfers list', async ({ request, baseURL }) => {
    const transferPayload = uniqueTransferPayload('journey');

    const createResponse = await request.post(`${baseURL}/api/v1/transfer`, {
      data: transferPayload,
    });

    const createStatus = createResponse.status();
    const createText = await createResponse.text();

    console.log('CREATE STATUS:', createStatus);
    console.log('CREATE BODY:', createText);

    expect(createStatus, createText).toBe(200);

    const createBody = JSON.parse(createText);
    expect(createBody).toHaveProperty('message');
    expect(typeof createBody.message).toBe('string');
    expect(createBody.message.length).toBeGreaterThan(0);
    expect(createBody).toHaveProperty('transactionId');
    expect(createBody.transactionId).toBeTruthy();

    let matchingTransfer: any | undefined;

    for (let page = 0; page < 5; page++) {
      const listResponse = await request.get(`${baseURL}/api/v1/transfer?page=${page}&size=20`);
      const listStatus = listResponse.status();
      const listText = await listResponse.text();

      console.log(`LIST STATUS [page=${page}]:`, listStatus);
      console.log(`LIST BODY [page=${page}]:`, listText);

      expect(listStatus, listText).toBe(200);

      const listBody = JSON.parse(listText);
      const transfers = normalizeListBody(listBody);

      matchingTransfer = transfers.find((item: any) =>
        item.fromAccount === transferPayload.fromAccount &&
        item.toAccount === transferPayload.toAccount &&
        Number(item.amount) === transferPayload.amount
      );

      if (matchingTransfer) break;
    }

    expect(matchingTransfer).toBeTruthy();
    expect(matchingTransfer.fromAccount).toBe(transferPayload.fromAccount);
    expect(matchingTransfer.toAccount).toBe(transferPayload.toAccount);
    expect(Number(matchingTransfer.amount)).toBe(transferPayload.amount);
  });
});
