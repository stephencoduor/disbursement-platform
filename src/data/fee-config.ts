import type { MobileMoneyCarrier, DisbursementIntent, FeeBreakdown } from "./types";

// Carrier fee rates
const carrierRates: Record<MobileMoneyCarrier, Record<DisbursementIntent, number>> = {
  airtel_money: {
    withdrawal: 0.025, // 2.5%
    purchase: 0.005,   // 0.5%
  },
  mtn_momo: {
    withdrawal: 0.025, // 2.5%
    purchase: 0.005,   // 0.5%
  },
  zamtel_kwacha: {
    withdrawal: 0.025, // 2.5%
    purchase: 0.005,   // 0.5%
  },
};

// Platform fee: 1% with minimum ZMW 2
const PLATFORM_FEE_RATE = 0.01;
const PLATFORM_FEE_MIN = 2;

// Levy: 0% (placeholder for future)
const LEVY_RATE = 0;

// Limits
export const networkLimits: Record<MobileMoneyCarrier, number> = {
  airtel_money: 10_000,
  mtn_momo: 10_000,
  zamtel_kwacha: 10_000,
};

export const platformLimits = {
  perTransaction: 5_000,
  dailyPerEmployee: 8_000,
  dailyPerCompany: 500_000,
};

export function calculateFees(
  netAmount: number,
  carrier: MobileMoneyCarrier,
  intent: DisbursementIntent
): FeeBreakdown {
  const carrierFee = netAmount * carrierRates[carrier][intent];
  const platformFee = Math.max(netAmount * PLATFORM_FEE_RATE, PLATFORM_FEE_MIN);
  const levy = netAmount * LEVY_RATE;
  const grossAmount = netAmount + carrierFee + platformFee + levy;

  return {
    netAmount,
    carrierFee: Math.round(carrierFee * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    levy: Math.round(levy * 100) / 100,
    grossAmount: Math.round(grossAmount * 100) / 100,
  };
}

export function validateDisbursementAmount(
  netAmount: number,
  carrier: MobileMoneyCarrier
): { valid: boolean; error?: string } {
  if (netAmount <= 0) {
    return { valid: false, error: "Amount must be greater than zero" };
  }

  if (netAmount > networkLimits[carrier]) {
    return {
      valid: false,
      error: `Exceeds network limit of ZMW ${networkLimits[carrier].toLocaleString()} per transaction`,
    };
  }

  if (netAmount > platformLimits.perTransaction) {
    return {
      valid: false,
      error: `Exceeds platform limit of ZMW ${platformLimits.perTransaction.toLocaleString()} per transaction`,
    };
  }

  return { valid: true };
}
