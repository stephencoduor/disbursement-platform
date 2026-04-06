/**
 * DisbursePro Audit Trail Service
 * Handles SHA-256 hash-chained audit events and chain verification.
 * Endpoints: /v1/dispro/audit/*
 */
import api from "./api-client";

export interface AuditEvent {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  payload: string;
  userId: string;
  userName: string;
  ipAddress: string;
  previousHash: string;
  hash: string;
  createdAt: string;
}

export interface ChainVerificationResult {
  valid: boolean;
  totalEvents: number;
  verifiedEvents: number;
  firstBrokenIndex: number | null;
  firstBrokenEventId: string | null;
  verifiedAt: string;
}

export const auditService = {
  /** List audit events with optional filters */
  listEvents(params?: { entityType?: string; entityId?: string; limit?: string; offset?: string }) {
    return api.get<AuditEvent[]>("/v1/dispro/audit/events", params as Record<string, string>);
  },

  /** Get a single audit event by ID */
  getEvent(eventId: string) {
    return api.get<AuditEvent>(`/v1/dispro/audit/events/${eventId}`);
  },

  /** Verify the integrity of the audit hash chain */
  verifyChain() {
    return api.post<ChainVerificationResult>("/v1/dispro/audit/events/verify-chain");
  },
};

export default auditService;
