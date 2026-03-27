import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/apiClient';
import { USERS, ACCOUNTS, UTILITY_PROVIDERS, TRANSFER_AMOUNT, PAYMENT_AMOUNT, REFERENCE_NUMBER } from '../fixtures/testData';

test.describe('User Journey - Internet Banking Core Service', () => {

  let client: ApiClient;

  test.beforeEach(({ request }) => {
    client = new ApiClient(request);
  });

  test('UJ-01: User looks up their profile and linked bank accounts', async () => {
    const { res, body } = await client.getUser(USERS.sam.identification);

    expect(res.status()).toBe(200);
    expect(body.firstName).toBe(USERS.sam.firstName);
    expect(body.lastName).toBe(USERS.sam.lastName);
    expect(body.email).toBe(USERS.sam.email);
    expect(body.identificationNumber).toBe(USERS.sam.identification);
    expect(Array.isArray(body.bankAccounts)).toBeTruthy();
    expect(body.bankAccounts.length).toBeGreaterThan(0);
  });

  test('UJ-02: User looks up a specific bank account', async () => {
    const { res, body } = await client.getBankAccount(ACCOUNTS.sam0.number);

    expect(res.status()).toBe(200);
    expect(body.number).toBe(ACCOUNTS.sam0.number);
    expect(body.status).toBe('ACTIVE');
    expect(body.type).toBe('SAVINGS_ACCOUNT');
    expect(body.availableBalance).toBeGreaterThan(0);
  });

  test('UJ-03: User transfers funds to another account', async () => {
    const { res, body } = await client.fundTransfer(
      ACCOUNTS.sam0.number,
      ACCOUNTS.guru0.number,
      TRANSFER_AMOUNT
    );

    expect(res.status()).toBe(200);
    expect(body.message).toBe('Transaction successfully completed');
    expect(body.transactionId).toBeTruthy();
    expect(body.transactionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  test('UJ-04: User pays a utility bill', async () => {
    const { res, body } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      UTILITY_PROVIDERS.vodafone.id,
      PAYMENT_AMOUNT,
      REFERENCE_NUMBER
    );

    expect(res.status()).toBe(200);
    expect(body.message).toBe('Utility payment successfully completed');
    expect(body.transactionId).toBeTruthy();
  });

  test('UJ-05: User looks up a utility provider account', async () => {
    const { res, body } = await client.getUtilityAccount(UTILITY_PROVIDERS.vodafone.name);

    expect(res.status()).toBe(200);
    expect(body.providerName).toBe(UTILITY_PROVIDERS.vodafone.name);
    expect(body.number).toBe(UTILITY_PROVIDERS.vodafone.number);
  });

  test('UJ-06: Full journey - lookup, transfer, then verify account is still accessible', async () => {
    // Step 1: Verify sender account exists
    const { body: senderBefore } = await client.getBankAccount(ACCOUNTS.sam1.number);
    expect(senderBefore.status).toBe('ACTIVE');

    // Step 2: Transfer funds
    const { res: transferRes, body: transferBody } = await client.fundTransfer(
      ACCOUNTS.sam1.number,
      ACCOUNTS.guru0.number,
      TRANSFER_AMOUNT
    );
    expect(transferRes.status()).toBe(200);
    expect(transferBody.transactionId).toBeTruthy();

    // Step 3: Verify sender account still accessible post-transfer
    const { res: postRes } = await client.getBankAccount(ACCOUNTS.sam1.number);
    expect(postRes.status()).toBe(200);
  });

  test('UJ-07: Browse paginated user list', async () => {
    const { res, body } = await client.getUsers(0, 5);

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body.length).toBeLessThanOrEqual(5);
  });

});
