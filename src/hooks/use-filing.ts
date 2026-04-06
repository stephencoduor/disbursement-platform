/**
 * Statutory filing hooks for DisbursePro.
 * Wraps filingService with mock fallback.
 */
import { useApiQuery, useApiMutation } from "./use-api";
import filingService, { type FilingHistoryEntry, type FilingGenerateRequest } from "../services/filing-service";

const MOCK_HISTORY: FilingHistoryEntry[] = [
  { filingId: "FILING-001", filingType: "PAYE", period: "2026-03", registrationNumber: "1001234567", status: "SUBMITTED", recordCount: 50, totalAmountNgwee: 245_000_00, totalAmountZmw: "245,000.00", submittedAt: "2026-04-05T10:30:00" },
  { filingId: "FILING-002", filingType: "NAPSA", period: "2026-03", registrationNumber: "NAPSA-EMP-001", status: "SUBMITTED", recordCount: 50, totalAmountNgwee: 85_410_00, totalAmountZmw: "85,410.00", submittedAt: "2026-04-05T10:35:00" },
  { filingId: "FILING-003", filingType: "NHIMA", period: "2026-03", registrationNumber: "NHIMA-001", status: "SUBMITTED", recordCount: 50, totalAmountNgwee: 24_600_00, totalAmountZmw: "24,600.00", submittedAt: "2026-04-05T10:40:00" },
  { filingId: "FILING-004", filingType: "PAYE", period: "2026-02", registrationNumber: "1001234567", status: "ACCEPTED", recordCount: 48, totalAmountNgwee: 238_500_00, totalAmountZmw: "238,500.00", submittedAt: "2026-03-05T09:15:00" },
  { filingId: "FILING-005", filingType: "NAPSA", period: "2026-02", registrationNumber: "NAPSA-EMP-001", status: "ACCEPTED", recordCount: 48, totalAmountNgwee: 83_200_00, totalAmountZmw: "83,200.00", submittedAt: "2026-03-05T09:20:00" },
];

export function useFilingHistory(employerTpin?: string) {
  return useApiQuery<FilingHistoryEntry[]>(
    () => filingService.getFilingHistory(employerTpin),
    [employerTpin],
    MOCK_HISTORY,
  );
}

export function useGeneratePayeReturn() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => filingService.generatePayeReturn(vars as FilingGenerateRequest),
  );
}

export function useGenerateNapsaSchedule() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => filingService.generateNapsaSchedule(vars as FilingGenerateRequest),
  );
}

export function useGenerateNhimaReturn() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => filingService.generateNhimaReturn(vars as FilingGenerateRequest),
  );
}
