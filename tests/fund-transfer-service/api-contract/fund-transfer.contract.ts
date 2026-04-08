import { test, expect, APIResponse } from '@playwright/test';

type TransferCreateResponse = {
  message?: string;
  transactionId?: string | number;
  [key: string]: unknown;
};

function uniqueTransferPayload(prefix: string) {
  const seed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  return {
    fromAccount: `FT-${prefix}-FROM-${seed}`,
    toAccount: `FT-${prefix}-TO-${seed}`,
    amount: 100.25,
    authID: `ft-${prefix}-auth`,
  };
}

function expectJsonContentType(response: APIResponse) {
  const contentType = response.headers()['content-type'] || '';
  expect(contentType).toContain('application/json');
}

function normalizeListBody(body: unknown): any[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object' && Array.isArray((body as any).content)) {
    return (body as any).content;
  }
  throw new Error(`Unsupported list response shape: ${JSON.stringify(body)}`);
}

test.describe('Fund Transfer Service - API Contract', () => {
  test('POST /api/v1/transfer should return valid success contract', async ({ request, baseURL }) => {
    const payload = uniqueTransferPayload('contract');

    const response = await request.post(`${baseURL}/api/v1/transfer`, {
      data: payload,
    });

    const status = response.status();
    const text = await response.text();

    console.log('POST status:', status);
    console.log('POST body:', text);

    expect(status, text).toBe(200);
    expectJsonContentType(response);

    const body = JSON.parse(text) as TransferCreateResponse;

    expect(body).toBeTruthy();
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message');
    expect(typeof body.message).toBe('string');
    expect(body.message!.length).toBeGreaterThan(0);

    expect(body).toHaveProperty('transactionId');
    expect(body.transactionId).toBeTruthy();
    expect(['string', 'number']).toContain(typeof body.transactionId);
  });

  test('GET /api/v1/transfer should return a valid list contract', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/v1/transfer?page=0&size=10`);

    const status = response.status();
    const text = await response.text();

    console.log('GET status:', status);
    console.log('GET body:', text);

    expect(status, text).toBe(200);
    expectJsonContentType(response);

    const body = JSON.parse(text);
    const transfers = normalizeListBody(body);

    expect(Array.isArray(transfers)).toBeTruthy();

    if (transfers.length > 0) {
      const item = transfers[0];
      expect(item).toHaveProperty('fromAccount');
      expect(item).toHaveProperty('toAccount');
      expect(item).toHaveProperty('amount');
      expect(item).toHaveProperty('status');

      expect(item.fromAccount).toBeTruthy();
      expect(item.toAccount).toBeTruthy();
      expect(Number.isNaN(Number(item.amount))).toBeFalsy();
    }
  });
});
