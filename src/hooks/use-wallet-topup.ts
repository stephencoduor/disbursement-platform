import { useApiQuery, useApiMutation } from "./use-api";
import walletTopUpService from "../services/wallet-topup-service";

// ── Mock fallback data ──────────────────────────────────────────────────────

const MOCK_BALANCE = {
  employerId: 1,
  availableBalance: 125000.0,
  pendingDeposits: 50000.0,
  pendingDisbursements: 32500.0,
  currency: "ZMW",
  lastUpdated: new Date().toISOString(),
};

const MOCK_TOPUP_HISTORY = [
  { id: 1, channel: "CARD", amount: 50000, status: "COMPLETED", date: "2026-04-01" },
  { id: 2, channel: "NFS", amount: 75000, status: "COMPLETED", date: "2026-03-28" },
  { id: 3, channel: "VIRTUAL_ACCOUNT", amount: 100000, status: "COMPLETED", date: "2026-03-15" },
  { id: 4, channel: "MOBILE_MONEY", amount: 25000, status: "COMPLETED", date: "2026-03-10" },
  { id: 5, channel: "CARD", amount: 30000, status: "FAILED", date: "2026-03-05" },
];

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useWalletBalance(employerId: number) {
  return useApiQuery(
    () => walletTopUpService.getBalance(employerId),
    [employerId],
    MOCK_BALANCE
  );
}

export function useTopUpHistory(employerId: number) {
  return useApiQuery(
    () => walletTopUpService.getTopUpHistory(employerId),
    [employerId],
    MOCK_TOPUP_HISTORY
  );
}

export function useTopUpViaVirtualAccount() {
  return useApiMutation((vars: unknown) => {
    const { employerId, amount, reference } = vars as { employerId: number; amount: number; reference?: string };
    return walletTopUpService.topUpViaVirtualAccount(employerId, amount, reference);
  });
}

export function useTopUpViaCard() {
  return useApiMutation((vars: unknown) => {
    const { employerId, amount, cardToken } = vars as { employerId: number; amount: number; cardToken: string };
    return walletTopUpService.topUpViaCard(employerId, amount, cardToken);
  });
}

export function useTopUpViaNfs() {
  return useApiMutation((vars: unknown) => {
    const { employerId, amount, sourceBankCode, sourceAccountNumber } = vars as {
      employerId: number; amount: number; sourceBankCode: string; sourceAccountNumber: string;
    };
    return walletTopUpService.topUpViaNfs(employerId, amount, sourceBankCode, sourceAccountNumber);
  });
}
