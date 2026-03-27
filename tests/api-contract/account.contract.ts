import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/apiClient';
import { ACCOUNTS, UTILITY_PROVIDERS } from '../fixtures/testData';

test.describe('API Contract - Account Controller', () => {

  let client: ApiClient;

  test.beforeEach(({ request }) => {
    client = new ApiClient(request);
  });

  test('AC-01: GET /api/v1/account/bank-account/:number returns correct schema', async () => {
    const { res, body } = await client.getBankAccount(ACCOUNTS.sam0.number);

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');

    // Schema validation
    expect(typeof body.id).toBe('number');
    expect(typeof body.number).toBe('string');
    expect(['SAVINGS_ACCOUNT', 'FIXED_DEPOSIT', 'LOAN_ACCOUNT']).toContain(body.type);
    expect(['PENDING', 'ACTIVE', 'DORMANT', 'BLOCKED']).toContain(body.status);
    expect(typeof body.availableBalance).toBe('number');
    expect(typeof body.actualBalance).toBe('number');
    expect(typeof body.user).toBe('object');
    expect(typeof body.user.id).toBe('number');
    expect(typeof body.user.firstName).toBe('string');
    expect(typeof body.user.email).toBe('string');
  });

  test('AC-02: GET /api/v1/account/bank-account/:number returns 400 with error schema for unknown account', async () => {
    const { res, body } = await client.getBankAccount('UNKNOWN-ACCOUNT-999');

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(typeof body.message).toBe('string');
    expect(body.code).toBe('BANKING-CORE-SERVICE-1000');
  });

  test('AC-03: GET /api/v1/account/util-account/:name returns correct schema', async () => {
    const { res, body } = await client.getUtilityAccount(UTILITY_PROVIDERS.vodafone.name);

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');

    expect(typeof body.id).toBe('number');
    expect(typeof body.number).toBe('string');
    expect(typeof body.providerName).toBe('string');
  });

  test('AC-04: GET /api/v1/account/util-account/:name returns 400 for unknown provider', async () => {
    const { res, body } = await client.getUtilityAccount('UNKNOWN_PROVIDER');

    expect(res.status()).toBe(400);
    expect(body.code).toBe('BANKING-CORE-SERVICE-1000');
    expect(typeof body.message).toBe('string');
  });

});
