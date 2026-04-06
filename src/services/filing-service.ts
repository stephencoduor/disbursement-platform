/**
 * DisbursePro Statutory Filing Service
 * Handles PAYE, NAPSA, NHIMA return generation and filing history.
 * Endpoints: /v1/dispro/statutory/filings/*
 */
import api from "./api-client";

export interface FilingGenerateRequest {
  employerTpin?: string;
  employerNumber?: string;
  employerCode?: string;
  period: string;
  employees: Array<Record<string, unknown>>;
}

export interface FilingResult {
  filename: string;
  csvContent: string;
  recordCount: number;
  totalPayeNgwee?: number;
  totalContributionNgwee?: number;
  totalEmployeeNgwee?: number;
  totalEmployerNgwee?: number;
  period: string;
  generatedAt: string;
}

export interface FilingHistoryEntry {
  filingId: string;
  filingType: string;
  period: string;
  registrationNumber: string;
  status: string;
  recordCount: number;
  totalAmountNgwee: number;
  totalAmountZmw: string;
  submittedAt: string;
}

export const filingService = {
  generatePayeReturn(req: FilingGenerateRequest) {
    return api.post<FilingResult>("/v1/dispro/statutory/filings/paye/generate", req);
  },
  generateNapsaSchedule(req: FilingGenerateRequest) {
    return api.post<FilingResult>("/v1/dispro/statutory/filings/napsa/generate", req);
  },
  generateNhimaReturn(req: FilingGenerateRequest) {
    return api.post<FilingResult>("/v1/dispro/statutory/filings/nhima/generate", req);
  },
  getFilingHistory(employerTpin?: string) {
    return api.get<FilingHistoryEntry[]>("/v1/dispro/statutory/filings/history",
      employerTpin ? { employerTpin } : undefined);
  },
  getFiling(filingId: string) {
    return api.get<FilingHistoryEntry>(`/v1/dispro/statutory/filings/history/${filingId}`);
  },
};

export default filingService;
