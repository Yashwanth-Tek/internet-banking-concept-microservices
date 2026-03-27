import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/apiClient';
import { ACCOUNTS, UTILITY_PROVIDERS, REFERENCE_NUMBER } from '../fixtures/testData';

test.describe('Integration - Core Banking Service', () => {

  let client: ApiClient;

  test.beforeEach(({ request }) => {
    client = new ApiClient(request);
  });

  test('IT-01: Fund transfer debits sender and credits receiver correctly', async () => {
    const transferAmount = 100;

    const { body: senderBefore } = await client.getBankAccount(ACCOUNTS.sam0.number);
    const { body: receiverBefore } = await client.getBankAccount(ACCOUNTS.guru0.number);

    const { res: transferRes, body: transferBody } = await client.fundTransfer(
      ACCOUNTS.sam0.number,
      ACCOUNTS.guru0.number,
      transferAmount
    );
    expect(transferRes.status()).toBe(200);

    const { body: senderAfter } = await client.getBankAccount(ACCOUNTS.sam0.number);
    const { body: receiverAfter } = await client.getBankAccount(ACCOUNTS.guru0.number);

    expect(senderAfter.actualBalance).toBeCloseTo(senderBefore.actualBalance - transferAmount, 2);
    expect(receiverAfter.actualBalance).toBeCloseTo(receiverBefore.actualBalance + transferAmount, 2);
  });

  test('IT-02: Utility payment reduces sender balance correctly', async () => {
    const paymentAmount = 150;

    const { body: accountBefore } = await client.getBankAccount(ACCOUNTS.sam0.number);

    const { res: payRes } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      UTILITY_PROVIDERS.airtel.id,
      paymentAmount,
      `${REFERENCE_NUMBER}-IT02`
    );
    expect(payRes.status()).toBe(200);

    const { body: accountAfter } = await client.getBankAccount(ACCOUNTS.sam0.number);

    expect(accountAfter.actualBalance).toBeCloseTo(accountBefore.actualBalance - paymentAmount, 2);
  });

  test('IT-03: Two consecutive fund transfers produce unique transaction IDs', async () => {
    const { body: tx1 } = await client.fundTransfer(
      ACCOUNTS.sam0.number,
      ACCOUNTS.guru0.number,
      50
    );
    const { body: tx2 } = await client.fundTransfer(
      ACCOUNTS.sam0.number,
      ACCOUNTS.guru0.number,
      50
    );

    expect(tx1.transactionId).not.toBe(tx2.transactionId);
  });

  test('IT-04: Two consecutive utility payments produce unique transaction IDs', async () => {
    const { body: tx1 } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      UTILITY_PROVIDERS.vodafone.id,
      50,
      `${REFERENCE_NUMBER}-A`
    );
    const { body: tx2 } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      UTILITY_PROVIDERS.vodafone.id,
      50,
      `${REFERENCE_NUMBER}-B`
    );

    expect(tx1.transactionId).not.toBe(tx2.transactionId);
  });

  test('IT-05: Fund transfer does not affect unrelated accounts', async () => {
    const { body: unrelatedBefore } = await client.getBankAccount(ACCOUNTS.ragu0.number);

    await client.fundTransfer(ACCOUNTS.sam0.number, ACCOUNTS.guru0.number, 100);

    const { body: unrelatedAfter } = await client.getBankAccount(ACCOUNTS.ragu0.number);

    expect(unrelatedAfter.actualBalance).toBeCloseTo(unrelatedBefore.actualBalance, 2);
  });

  test('IT-06: Utility account data is consistent across multiple lookups', async () => {
    const { body: first }  = await client.getUtilityAccount(UTILITY_PROVIDERS.vodafone.name);
    const { body: second } = await client.getUtilityAccount(UTILITY_PROVIDERS.vodafone.name);

    expect(first.id).toBe(second.id);
    expect(first.number).toBe(second.number);
    expect(first.providerName).toBe(second.providerName);
  });

  test('IT-07: User data is consistent across multiple lookups', async () => {
    const { body: first }  = await client.getUser('808829932V');
    const { body: second } = await client.getUser('808829932V');

    expect(first.id).toBe(second.id);
    expect(first.email).toBe(second.email);
    expect(first.bankAccounts.length).toBe(second.bankAccounts.length);
  });

  test('IT-08: Sequential fund transfer then utility payment both succeed and reflect correct balance', async () => {
    const transferAmount = 100;
    const paymentAmount  = 50;

    const { body: before } = await client.getBankAccount(ACCOUNTS.sam0.number);

    const { res: transferRes } = await client.fundTransfer(
      ACCOUNTS.sam0.number,
      ACCOUNTS.guru0.number,
      transferAmount
    );
    expect(transferRes.status()).toBe(200);

    const { res: payRes } = await client.utilityPayment(
      ACCOUNTS.sam0.number,
      UTILITY_PROVIDERS.verizon.id,
      paymentAmount,
      `${REFERENCE_NUMBER}-IT08`
    );
    expect(payRes.status()).toBe(200);

    const { body: after } = await client.getBankAccount(ACCOUNTS.sam0.number);

    expect(after.actualBalance).toBeCloseTo(
      before.actualBalance - transferAmount - paymentAmount,
      2
    );
  });

});
