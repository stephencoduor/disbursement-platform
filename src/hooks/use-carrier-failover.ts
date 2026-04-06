/**
 * Carrier failover hooks for DisbursePro.
 * Wraps the failover API for health monitoring and retry disbursements.
 */
import { useApiQuery, useApiMutation } from "./use-api";
import api from "../services/api-client";

export interface CarrierHealthStats {
  carrier: string;
  healthScore: number;
  successRate: number;
  p95LatencyMs: number;
  sampleCount: number;
}

const MOCK_HEALTH: Record<string, CarrierHealthStats> = {
  AIRTEL: { carrier: "AIRTEL", healthScore: 95, successRate: 98.5, p95LatencyMs: 1800, sampleCount: 50 },
  MTN: { carrier: "MTN", healthScore: 92, successRate: 97.0, p95LatencyMs: 2100, sampleCount: 45 },
  ZAMTEL: { carrier: "ZAMTEL", healthScore: 88, successRate: 95.0, p95LatencyMs: 2500, sampleCount: 30 },
};

export function useCarrierHealth() {
  return useApiQuery<Record<string, CarrierHealthStats>>(
    () => api.get("/v1/dispro/mobilemoney/failover/health"),
    [],
    MOCK_HEALTH,
  );
}

export function useDisburseWithRetry() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => api.post("/v1/dispro/mobilemoney/failover/disburse", vars),
  );
}
