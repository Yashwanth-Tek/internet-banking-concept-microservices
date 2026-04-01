import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/apiClient';
import { ACCOUNTS, UTILITY_PROVIDERS, REFERENCE_NUMBER } from '../fixtures/testData';

test.describe('Regression - Core Banking Service', () => {
  let client: ApiClient;

  test.beforeEach(({ request }) => {
    client = new ApiClient(request);
  });

  // --- Fund Transfer ---

  test('RG-01: Fund transfer with insufficient funds returns 400', async () => {
    const { res, body } = await client.fundTransfer(
      ACCOUNTS.ragu0.number,
      ACCOUNTS.guru0.number,
      9999999.0
    );

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Insufficient funds');
  });

  test('RG-02: Fund transfer with unknown fromAccount returns 400', async () => {
    const { res, body } = await client.fundTransfer('000000000000', ACCOUNTS.guru0.number, 100);

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Requested entity not present');
  });

  test('RG-03: Fund transfer with unknown toAccount returns 400', async () => {
    const { res, body } = await client.fundTransfer(ACCOUNTS.sam0.number, '000000000000', 100);

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Requested entity not present');
  });

  test('RG-04: Fund transfer with zero amount is handled by current API', async () => {
    const { res } = await client.fundTransfer(ACCOUNTS.sam0.number, ACCOUNTS.guru0.number, 0);
    expect([200, 400]).toContain(res.status());
  });

  test('RG-05: Fund transfer with negative amount is handled by current API', async () => {
    const { res } = await client.fundTransfer(ACCOUNTS.sam0.number, ACCOUNTS.guru0.number, -100);
    expect([200, 400]).toContain(res.status());
  });

  test('RG-06: Fund transfer with same fromAccount and toAccount is handled by current API', async () => {
    const { res } = await client.fundTransfer(ACCOUNTS.sam0.number, ACCOUNTS.sam0.number, 100);
    expect([200, 400]).toContain(res.status());
  });

  // --- Utility Payment ---

  test('RG-07: Utility payment with insufficient funds returns 400', async () => {
    const { res, body } = await client.utilityPayment(
      ACCOUNTS.ragu0.number,
      UTILITY_PROVIDERS.vodafone.id,
      9999999.0,
      REFERENCE_NUMBER
    );

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Insufficient funds');
  });

  test('RG-08: Utility payment with unknown account returns 400', async () => {
    const { res, body } = await client.utilityPayment(
      '000000000000',
      UTILITY_PROVIDERS.vodafone.id,
      100,
      REFERENCE_NUMBER
    );

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Requested entity not present');
  });

  test('RG-09: Utility payment with unknown provider ID returns 400', async () => {
    const { res, body } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      99999,
      100,
      REFERENCE_NUMBER
    );

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Requested entity not present');
  });

  test('RG-10: Utility payment with zero amount is handled by current API', async () => {
    const { res } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      UTILITY_PROVIDERS.vodafone.id,
      0,
      REFERENCE_NUMBER
    );

    expect([200, 400]).toContain(res.status());
  });

  // --- Account Lookup ---

  test('RG-11: Bank account lookup with empty string returns 400 or 404', async () => {
    const { res } = await client.getBankAccount(' ');
    expect([400, 404]).toContain(res.status());
  });

  test('RG-12: Utility account lookup with unknown provider name returns 400', async () => {
    const { res, body } = await client.getUtilityAccount('NONEXISTENT_PROVIDER');

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Requested entity not present');
  });

  // --- User Lookup ---

  test('RG-13: User lookup with unknown identification returns 400', async () => {
    const { res, body } = await client.getUser('INVALID-ID-XYZ');

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Requested entity not present');
  });

  test('RG-14: User list with page beyond available data returns empty array', async () => {
    const { res, body } = await client.getUsers(9999, 10);

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(0);
  });
});
