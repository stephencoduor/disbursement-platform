/**
 * Approval workflow hooks for DisbursePro.
 * Wraps approvalService with mock fallback for maker-checker + TOTP.
 */
import { useApiQuery, useApiMutation } from "./use-api";
import approvalService, { type ApprovalPolicy, type ApprovalHardenRequest } from "../services/approval-service";

const MOCK_POLICY: ApprovalPolicy = {
  batchId: "BATCH-001",
  requiredApprovers: 2,
  currentApprovers: 1,
  totpRequired: false,
  tier: 1,
  thresholdZmw: 50000,
  status: "AWAITING_APPROVAL",
};

export function useApprovalPolicy(batchId: string) {
  return useApiQuery<ApprovalPolicy>(
    () => approvalService.getPolicy(batchId),
    [batchId],
    MOCK_POLICY,
  );
}

export function useHardenApproval() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => approvalService.harden(vars as ApprovalHardenRequest),
  );
}

export function useEnrollTotp() {
  return useApiMutation(
    () => approvalService.enrollTotp(),
  );
}

export function useVerifyTotp() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => approvalService.verifyTotp(vars.code),
  );
}
