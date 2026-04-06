/**
 * KYB (Know Your Business) hooks for DisbursePro.
 * Wraps kybService with mock fallback for employer verification.
 */
import { useApiQuery, useApiMutation } from "./use-api";
import kybService, { type EmployerStatus, type EmployerRegistration, type DocumentUpload } from "../services/kyb-service";

const MOCK_STATUS: EmployerStatus = {
  employerId: "COMP-001",
  companyName: "Copperbelt Transport Services Ltd",
  tpin: "1001234567",
  status: "APPROVED",
  submittedAt: "2026-01-15T10:00:00Z",
  reviewedAt: "2026-01-18T14:30:00Z",
  rejectionReason: null,
  requiredDocuments: ["TPIN_CERTIFICATE", "PACRA_CERTIFICATE", "BOARD_RESOLUTION", "DIRECTOR_ID"],
  submittedDocuments: ["TPIN_CERTIFICATE", "PACRA_CERTIFICATE", "BOARD_RESOLUTION", "DIRECTOR_ID"],
};

export function useEmployerStatus(employerId: string) {
  return useApiQuery<EmployerStatus>(
    () => kybService.getEmployerStatus(employerId),
    [employerId],
    MOCK_STATUS,
  );
}

export function useRegisterEmployer() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => kybService.registerEmployer(vars as EmployerRegistration),
  );
}

export function useUploadDocument() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => kybService.uploadDocument(vars.employerId, vars as DocumentUpload),
  );
}
