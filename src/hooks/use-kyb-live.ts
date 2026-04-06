import { useApiQuery, useApiMutation } from "./use-api";
import kybLiveService from "../services/kyb-live-service";

// ── Mock fallback data ──────────────────────────────────────────────────────

const MOCK_COMPANY_VERIFICATION = {
  registrationNumber: "120150012345",
  status: "ACTIVE",
  verified: true,
  companyName: "Copperbelt Transport Services Ltd",
  companyType: "PRIVATE_LIMITED",
  incorporationDate: "2018-03-15",
  registeredOffice: "Plot 2345, Cairo Road, Lusaka",
  annualReturnDue: "2026-06-30",
  annualReturnFiled: false,
  directors: [
    { name: "Bwalya Mulenga", role: "DIRECTOR", nationality: "ZAMBIAN", idNumber: "123456/78/1" },
    { name: "Chanda Kapasa", role: "SECRETARY", nationality: "ZAMBIAN", idNumber: "234567/89/1" },
  ],
  shareholders: [
    { name: "Bwalya Mulenga", shares: 60, class: "ORDINARY" },
    { name: "Chanda Kapasa", shares: 40, class: "ORDINARY" },
  ],
};

const MOCK_SANCTIONS_STATS = {
  OFAC_SDN: { entries: 2 },
  UN_1267: { entries: 1 },
  BOZ_RESTRICTED: { entries: 1 },
  PEP_ZAMBIA: { entries: 2 },
  lastRefresh: new Date().toISOString(),
  matchThreshold: 0.85,
};

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useCompanyVerification(registrationNumber: string) {
  return useApiQuery(
    () => kybLiveService.verifyCompany(registrationNumber),
    [registrationNumber],
    MOCK_COMPANY_VERIFICATION
  );
}

export function useAnnualReturn(registrationNumber: string) {
  return useApiQuery(
    () => kybLiveService.checkAnnualReturn(registrationNumber),
    [registrationNumber],
    { registrationNumber, currentYear: 2026, filingDeadline: "2026-06-30", filed: false, lastFiledYear: 2025, penalty: false, penaltyAmount: 0 }
  );
}

export function useSanctionsStats() {
  return useApiQuery(
    () => kybLiveService.getSanctionsStats(),
    [],
    MOCK_SANCTIONS_STATS
  );
}

export function useVerifyCompany() {
  return useApiMutation((vars: unknown) => {
    const { registrationNumber } = vars as { registrationNumber: string };
    return kybLiveService.verifyCompany(registrationNumber);
  });
}

export function useScreenIndividual() {
  return useApiMutation((vars: unknown) => {
    const { name, nationality, idNumber } = vars as { name: string; nationality?: string; idNumber?: string };
    return kybLiveService.screenIndividual(name, nationality, idNumber);
  });
}

export function useTriggerAnnualRefresh() {
  return useApiMutation((vars: unknown) => {
    const { registrationNumber } = vars as { registrationNumber: string };
    return kybLiveService.triggerAnnualRefresh(registrationNumber);
  });
}
