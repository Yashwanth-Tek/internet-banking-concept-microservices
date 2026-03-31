import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/apiClient';
import { USERS } from '../fixtures/testData';

test.describe('API Contract - User Controller', () => {
  let client: ApiClient;

  test.beforeEach(({ request }) => {
    client = new ApiClient(request);
  });

  test('AC-05: GET /api/v1/user/:identification returns correct schema', async () => {
    const { res, body } = await client.getUser(USERS.sam.identification);

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    expect(typeof body.id).toBe('number');
    expect(typeof body.firstName).toBe('string');
    expect(typeof body.lastName).toBe('string');
    expect(typeof body.email).toBe('string');
    expect(typeof body.identificationNumber).toBe('string');
    expect(Array.isArray(body.bankAccounts)).toBeTruthy();
  });

  test('AC-06: GET /api/v1/user/:identification returns 400 with current error schema for unknown user', async () => {
    const { res, body } = await client.getUser('UNKNOWN-ID-000');

    expect(res.status()).toBe(400);
    expect(typeof body.code).toBe('string');
    expect(body.code).toContain('Requested entity not present');
  });

  test('AC-07: GET /api/v1/user returns paginated list schema', async () => {
    const { res, body } = await client.getUsers(0, 10);

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    expect(Array.isArray(body)).toBeTruthy();

    if (body.length > 0) {
      const user = body[0];
      expect(typeof user.id).toBe('number');
      expect(typeof user.firstName).toBe('string');
      expect(typeof user.lastName).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.identificationNumber).toBe('string');
    }
  });

  test('AC-08: GET /api/v1/user respects page size param', async () => {
    const { res, body } = await client.getUsers(0, 2);

    expect(res.status()).toBe(200);
    expect(body.length).toBeLessThanOrEqual(2);
  });
});
