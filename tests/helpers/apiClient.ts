import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async getBankAccount(accountNumber: string) {
    const res = await this.request.get(`/api/v1/account/bank-account/${accountNumber}`);
    return { res, body: await res.json() };
  }

  async getUtilityAccount(providerName: string) {
    const res = await this.request.get(`/api/v1/account/util-account/${providerName}`);
    return { res, body: await res.json() };
  }

  async getUser(identification: string) {
    const res = await this.request.get(`/api/v1/user/${identification}`);
    return { res, body: await res.json() };
  }

  async getUsers(page = 0, size = 10) {
    const res = await this.request.get(`/api/v1/user?page=${page}&size=${size}`);
    return { res, body: await res.json() };
  }

  async fundTransfer(fromAccount: string, toAccount: string, amount: number) {
    const res = await this.request.post('/api/v1/transaction/fund-transfer', {
      data: { fromAccount, toAccount, amount },
    });
    return { res, body: await res.json() };
  }

  async utilityPayment(account: string, providerId: number, amount: number, referenceNumber: string) {
    const res = await this.request.post('/api/v1/transaction/util-payment', {
      data: { account, providerId, amount, referenceNumber },
    });
    return { res, body: await res.json() };
  }
}
