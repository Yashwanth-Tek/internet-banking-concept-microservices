import { test, expect } from '@playwright/test';

function uniqueTransferPayload(prefix: string, amount: number) {
  const seed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  return {
    fromAccount: `FT-${prefix}-FROM-${seed}`,
    toAccount: `FT-${prefix}-TO-${seed}`,
    amount,
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

test.describe('Fund Transfer Service - Regression', () => {
  test('should handle multiple transfer creations without failure', async ({ request, baseURL }) => {
    const payloads = [
      uniqueTransferPayload('reg-1', 50),
      uniqueTransferPayload('reg-2', 75),
      uniqueTransferPayload('reg-3', 125),
    ];

    for (const payload of payloads) {
      const response = await request.post(`${baseURL}/api/v1/transfer`, {
        data: payload,
      });

      const text = await response.text();

      console.log('CREATE STATUS:', response.status());
      console.log('CREATE BODY:', text);

      expect(response.status(), text).toBe(200);

      const body = JSON.parse(text);
      expect(body).toHaveProperty('message');
      expect(typeof body.message).toBe('string');
      expect(body.message.length).toBeGreaterThan(0);
      expect(body).toHaveProperty('transactionId');
      expect(body.transactionId).toBeTruthy();
    }
  });

  test('GET should support pagination params', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/v1/transfer?page=0&size=5`);
    const text = await response.text();

    console.log('GET STATUS:', response.status());
    console.log('GET BODY:', text);

    expect(response.status(), text).toBe(200);

    const body = JSON.parse(text);
    const transfers = normalizeListBody(body);

    expect(Array.isArray(transfers)).toBeTruthy();
    expect(transfers.length).toBeLessThanOrEqual(5);
  });

  test('service should remain responsive after transfer creation', async ({ request, baseURL }) => {
    const createResponse = await request.post(`${baseURL}/api/v1/transfer`, {
      data: uniqueTransferPayload('reg-stability', 500),
    });

    const createText = await createResponse.text();

    console.log('CREATE STATUS:', createResponse.status());
    console.log('CREATE BODY:', createText);

    expect(createResponse.status(), createText).toBe(200);

    const followupResponse = await request.get(`${baseURL}/api/v1/transfer?page=0&size=1`);
    const followupText = await followupResponse.text();

    console.log('FOLLOWUP STATUS:', followupResponse.status());
    console.log('FOLLOWUP BODY:', followupText);

    expect(followupResponse.status(), followupText).toBe(200);
  });
});
