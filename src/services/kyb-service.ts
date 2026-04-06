/**
 * DisbursePro KYB (Know Your Business) Service
 * Handles employer registration, TPIN/PACRA verification, document upload.
 * Endpoints: /v1/dispro/kyb/*
 */
import api from "./api-client";

export interface EmployerRegistration {
  companyName: string;
  tpin: string;
  pacraNumber: string;
  registeredAddress: string;
  city: string;
  province: string;
  contactEmail: string;
  contactPhone: string;
  directors: Array<{
    fullName: string;
    nrcNumber: string;
    role: string;
  }>;
}

export interface EmployerStatus {
  employerId: string;
  companyName: string;
  tpin: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  requiredDocuments: string[];
  submittedDocuments: string[];
}

export interface DocumentUpload {
  documentType: "TPIN_CERTIFICATE" | "PACRA_CERTIFICATE" | "BOARD_RESOLUTION" | "DIRECTOR_ID";
  fileName: string;
  fileBase64: string;
}

export const kybService = {
  /** Register a new employer */
  registerEmployer(req: EmployerRegistration) {
    return api.post<{ employerId: string; status: string }>("/v1/dispro/kyb/employers", req);
  },

  /** Get employer KYB status */
  getEmployerStatus(employerId: string) {
    return api.get<EmployerStatus>(`/v1/dispro/kyb/employers/${employerId}/status`);
  },

  /** Upload a KYB document */
  uploadDocument(employerId: string, doc: DocumentUpload) {
    return api.post<{ documentId: string; status: string }>(
      `/v1/dispro/kyb/employers/${employerId}/documents`,
      doc,
    );
  },
};

export default kybService;
