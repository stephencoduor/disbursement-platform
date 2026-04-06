/**
 * Audit trail hooks for DisbursePro.
 * Wraps auditService with mock fallback for hash-chained audit events.
 */
import { useApiQuery, useApiMutation } from "./use-api";
import auditService, { type AuditEvent, type ChainVerificationResult } from "../services/audit-service";

// Mock audit events matching the DisbursePro audit log page
const MOCK_EVENTS: AuditEvent[] = [
  {
    id: "EVT-001",
    entityType: "DISBURSEMENT",
    entityId: "DIS-2026-0042",
    action: "APPROVED",
    payload: '{"amount":250000,"carrier":"AIRTEL","approver":"mwamba.kapumba"}',
    userId: "USR-001",
    userName: "Mwamba Kapumba",
    ipAddress: "41.72.108.45",
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "a3f2c8d1e5b7904f6a2c8d1e5b7904f6a3f2c8d1e5b7904f6a2c8d1e5b79040",
    createdAt: "2026-04-03T14:30:00Z",
  },
  {
    id: "EVT-002",
    entityType: "EMPLOYEE",
    entityId: "EMP-015",
    action: "CREATED",
    payload: '{"name":"Chilufya Mwansa","nrc":"123456/78/1","carrier":"MTN"}',
    userId: "USR-002",
    userName: "Bwalya Mutale",
    ipAddress: "41.72.108.52",
    previousHash: "a3f2c8d1e5b7904f6a2c8d1e5b7904f6a3f2c8d1e5b7904f6a2c8d1e5b79040",
    hash: "b4e3d9c2f6a8015e7b3d9c2f6a8015e7b4e3d9c2f6a8015e7b3d9c2f6a80151",
    createdAt: "2026-04-03T13:15:00Z",
  },
  {
    id: "EVT-003",
    entityType: "WALLET",
    entityId: "COMP-001",
    action: "CREDITED",
    payload: '{"amount":500000,"reference":"WC-2026-0402","by":"Platform Operations"}',
    userId: "USR-SYS",
    userName: "System",
    ipAddress: "10.0.0.1",
    previousHash: "b4e3d9c2f6a8015e7b3d9c2f6a8015e7b4e3d9c2f6a8015e7b3d9c2f6a80151",
    hash: "c5f4e0d3g7b9126f8c4e0d3g7b9126f8c5f4e0d3g7b9126f8c4e0d3g7b91262",
    createdAt: "2026-04-02T16:45:00Z",
  },
  {
    id: "EVT-004",
    entityType: "DISBURSEMENT",
    entityId: "DIS-2026-0041",
    action: "REJECTED",
    payload: '{"amount":850000,"reason":"Exceeds daily limit","rejector":"chanda.mutale"}',
    userId: "USR-003",
    userName: "Chanda Mutale",
    ipAddress: "41.72.108.60",
    previousHash: "c5f4e0d3g7b9126f8c4e0d3g7b9126f8c5f4e0d3g7b9126f8c4e0d3g7b91262",
    hash: "d6g5f1e4h8c0237g9d5f1e4h8c0237g9d6g5f1e4h8c0237g9d5f1e4h8c02373",
    createdAt: "2026-04-02T11:30:00Z",
  },
  {
    id: "EVT-005",
    entityType: "AUTH",
    entityId: "USR-001",
    action: "LOGIN",
    payload: '{"method":"password","mfa":true}',
    userId: "USR-001",
    userName: "Mwamba Kapumba",
    ipAddress: "41.72.108.45",
    previousHash: "d6g5f1e4h8c0237g9d5f1e4h8c0237g9d6g5f1e4h8c0237g9d5f1e4h8c02373",
    hash: "e7h6g2f5i9d1348h0e6g2f5i9d1348h0e7h6g2f5i9d1348h0e6g2f5i9d13484",
    createdAt: "2026-04-02T08:00:00Z",
  },
];

const MOCK_CHAIN_RESULT: ChainVerificationResult = {
  valid: true,
  totalEvents: 5,
  verifiedEvents: 5,
  firstBrokenIndex: null,
  firstBrokenEventId: null,
  verifiedAt: new Date().toISOString(),
};

export function useAuditEvents(params?: { entityType?: string; limit?: string }) {
  return useApiQuery<AuditEvent[]>(
    () => auditService.listEvents(params),
    [params?.entityType, params?.limit],
    MOCK_EVENTS,
  );
}

export function useAuditEvent(eventId: string) {
  const fallback = MOCK_EVENTS.find((e) => e.id === eventId);
  return useApiQuery<AuditEvent>(
    () => auditService.getEvent(eventId),
    [eventId],
    fallback,
  );
}

export function useVerifyChain() {
  return useApiMutation(
    () => auditService.verifyChain(),
  );
}
