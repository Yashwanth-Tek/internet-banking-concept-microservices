import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/apiClient';
import { ACCOUNTS, UTILITY_PROVIDERS, TRANSFER_AMOUNT, PAYMENT_AMOUNT, REFERENCE_NUMBER } from '../fixtures/testData';

test.describe('API Contract - Transaction Controller', () => {

  let client: ApiClient;

  test.beforeEach(({ request }) => {
    client = new ApiClient(request);
  });

  test('AC-09: POST /api/v1/transaction/fund-transfer returns correct schema', async () => {
    const { res, body } = await client.fundTransfer(
      ACCOUNTS.sam0.number,
      ACCOUNTS.guru0.number,
      TRANSFER_AMOUNT
    );

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');

    expect(typeof body.message).toBe('string');
    expect(typeof body.transactionId).toBe('string');
    expect(body.transactionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  test('AC-10: POST /api/v1/transaction/util-payment returns correct schema', async () => {
    const { res, body } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      UTILITY_PROVIDERS.verizon.id,
      PAYMENT_AMOUNT,
      REFERENCE_NUMBER
    );

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');

    expect(typeof body.message).toBe('string');
    expect(typeof body.transactionId).toBe('string');
    expect(body.transactionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  test('AC-11: POST /api/v1/transaction/fund-transfer returns 400 error schema for unknown account', async () => {
    const { res, body } = await client.fundTransfer('INVALID-ACC', ACCOUNTS.guru0.number, TRANSFER_AMOUNT);

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(typeof body.message).toBe('string');
  });

  test('AC-12: POST /api/v1/transaction/util-payment returns 400 error schema for unknown account', async () => {
    const { res, body } = await client.utilityPayment(
      'INVALID-ACC',
      UTILITY_PROVIDERS.vodafone.id,
      PAYMENT_AMOUNT,
      REFERENCE_NUMBER
    );

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(typeof body.message).toBe('string');
  });

});
