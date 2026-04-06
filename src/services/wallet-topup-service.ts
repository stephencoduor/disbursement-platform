import api from "./api-client";

const walletTopUpService = {
  getBalance: (employerId: number) =>
    api.get(`/v1/dispro/wallet/balance/${employerId}`),

  topUpViaVirtualAccount: (employerId: number, amount: number, reference?: string) =>
    api.post("/v1/dispro/wallet/topup/virtual-account", { employerId, amount, reference }),

  topUpViaCard: (employerId: number, amount: number, cardToken: string) =>
    api.post("/v1/dispro/wallet/topup/card", { employerId, amount, cardToken }),

  topUpViaNfs: (employerId: number, amount: number, sourceBankCode: string, sourceAccountNumber: string) =>
    api.post("/v1/dispro/wallet/topup/nfs", { employerId, amount, sourceBankCode, sourceAccountNumber }),

  getTopUpHistory: (employerId: number) =>
    api.get(`/v1/dispro/wallet/topup/history/${employerId}`),
};

export default walletTopUpService;
