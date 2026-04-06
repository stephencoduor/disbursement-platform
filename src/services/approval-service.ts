/**
 * DisbursePro Approval & 2FA Hardening Service
 * Handles maker-checker workflow, TOTP enrollment, and second-factor verification.
 * Endpoints: /v1/dispro/approval/*
 */
import api from "./api-client";

export interface ApprovalPolicy {
  batchId: string;
  requiredApprovers: number;
  currentApprovers: number;
  totpRequired: boolean;
  tier: number;
  thresholdZmw: number;
  status: "AWAITING_APPROVAL" | "APPROVED" | "REJECTED";
}

export interface TotpEnrollResponse {
  secret: string;
  qrCodeDataUri: string;
  issuer: string;
  accountName: string;
}

export interface ApprovalHardenRequest {
  batchId: string;
  action: "APPROVE" | "REJECT";
  totpCode?: string;
  comment?: string;
}

export const approvalService = {
  /** Get approval policy for a batch */
  getPolicy(batchId: string) {
    return api.get<ApprovalPolicy>(`/v1/dispro/approval/policy/${batchId}`);
  },

  /** Submit approval/rejection with optional TOTP */
  harden(req: ApprovalHardenRequest) {
    return api.post<{ status: string; approvedAt: string }>("/v1/dispro/approval/harden", req);
  },

  /** Enroll for TOTP (returns QR code) */
  enrollTotp() {
    return api.post<TotpEnrollResponse>("/v1/dispro/approval/enroll-totp");
  },

  /** Verify a TOTP code */
  verifyTotp(code: string) {
    return api.post<{ valid: boolean }>("/v1/dispro/approval/verify-totp", { code });
  },
};

export default approvalService;
