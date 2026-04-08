import { test, expect } from '@playwright/test';

function uniqueTransferPayload(prefix: string) {
  const seed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  return {
    fromAccount: `FT-${prefix}-FROM-${seed}`,
    toAccount: `FT-${prefix}-TO-${seed}`,
    amount: 999.99,
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

test.describe('Fund Transfer Service - Integration', () => {
  test('created transfer should be persisted and visible via GET endpoint', async ({ request, baseURL }) => {
    const payload = uniqueTransferPayload('integration');

    const createResponse = await request.post(`${baseURL}/api/v1/transfer`, {
      data: payload,
    });

    const createText = await createResponse.text();
    console.log('CREATE STATUS:', createResponse.status());
    console.log('CREATE BODY:', createText);

    expect(createResponse.status(), createText).toBe(200);

    const createBody = JSON.parse(createText);
    expect(createBody.transactionId).toBeTruthy();

    let found: any | undefined;

    for (let page = 0; page < 5; page++) {
      const listResponse = await request.get(`${baseURL}/api/v1/transfer?page=${page}&size=20`);
      const listText = await listResponse.text();

      console.log(`LIST STATUS [page=${page}]:`, listResponse.status());
      console.log(`LIST BODY [page=${page}]:`, listText);

      expect(listResponse.status(), listText).toBe(200);

      const listBody = JSON.parse(listText);
      const transfers = normalizeListBody(listBody);

      found = transfers.find((t: any) =>
        t.fromAccount === payload.fromAccount &&
        t.toAccount === payload.toAccount &&
        Number(t.amount) === payload.amount
      );

      if (found) break;
    }

    expect(found).toBeTruthy();
    expect(found.fromAccount).toBe(payload.fromAccount);
    expect(found.toAccount).toBe(payload.toAccount);
    expect(Number(found.amount)).toBe(payload.amount);
    expect(found.status).toBeTruthy();
  });
});
