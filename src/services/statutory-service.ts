/**
 * DisbursePro Statutory Calculation Service
 * Handles Zambian PAYE, NAPSA, NHIMA, SDL calculations.
 * Endpoints: /v1/dispro/statutory/*
 */
import api from "./api-client";

export interface PayrollCalculationRequest {
  employeeId: string;
  grossSalaryNgwee: number;
  period: string; // "2026-04"
  allowancesNgwee?: number;
  deductionsNgwee?: number;
}

export interface PayrollCalculationResponse {
  employeeId: string;
  period: string;
  grossNgwee: number;
  payeNgwee: number;
  napsaEmployeeNgwee: number;
  napsaEmployerNgwee: number;
  nhimaEmployeeNgwee: number;
  nhimaEmployerNgwee: number;
  sdlEmployerNgwee: number;
  netPayNgwee: number;
  effectiveTaxRate: number;
  breakdown: {
    payeBands: Array<{
      bandLabel: string;
      rate: number;
      taxableInBandNgwee: number;
      taxNgwee: number;
    }>;
  };
}

export interface PayeBand {
  id: number;
  lowerNgwee: number;
  upperNgwee: number | null;
  ratePercent: number;
  label: string;
}

export interface StatutoryCeiling {
  type: string;
  monthlyMaxNgwee: number;
  ratePercent: number;
  effectiveFrom: string;
}

export const statutoryService = {
  /** Calculate full payroll deductions for an employee */
  calculate(req: PayrollCalculationRequest) {
    return api.post<PayrollCalculationResponse>("/v1/dispro/statutory/calculate", req);
  },

  /** Get current PAYE bands */
  getPayeBands() {
    return api.get<PayeBand[]>("/v1/dispro/statutory/bands/paye");
  },

  /** Get statutory ceilings (NAPSA, NHIMA, SDL) */
  getCeilings() {
    return api.get<StatutoryCeiling[]>("/v1/dispro/statutory/ceilings");
  },
};

export default statutoryService;
