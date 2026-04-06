/**
 * Statutory calculation hooks for DisbursePro.
 * Wraps statutoryService with mock fallback for Zambian tax calculations.
 */
import { useApiQuery, useApiMutation } from "./use-api";
import statutoryService, {
  type PayeBand,
  type StatutoryCeiling,
  type PayrollCalculationRequest,
  type PayrollCalculationResponse,
} from "../services/statutory-service";

// 2025 Zambian PAYE bands (real rates)
const MOCK_PAYE_BANDS: PayeBand[] = [
  { id: 1, lowerNgwee: 0, upperNgwee: 540_000, ratePercent: 0, label: "0 – ZMW 5,400" },
  { id: 2, lowerNgwee: 540_001, upperNgwee: 960_000, ratePercent: 20, label: "ZMW 5,400.01 – 9,600" },
  { id: 3, lowerNgwee: 960_001, upperNgwee: 1_260_000, ratePercent: 30, label: "ZMW 9,600.01 – 12,600" },
  { id: 4, lowerNgwee: 1_260_001, upperNgwee: null, ratePercent: 37, label: "Above ZMW 12,600" },
];

const MOCK_CEILINGS: StatutoryCeiling[] = [
  { type: "NAPSA_EMPLOYEE", monthlyMaxNgwee: 170_820, ratePercent: 5, effectiveFrom: "2025-01-01" },
  { type: "NAPSA_EMPLOYER", monthlyMaxNgwee: 170_820, ratePercent: 5, effectiveFrom: "2025-01-01" },
  { type: "NHIMA_EMPLOYEE", monthlyMaxNgwee: 0, ratePercent: 1, effectiveFrom: "2025-01-01" },
  { type: "NHIMA_EMPLOYER", monthlyMaxNgwee: 0, ratePercent: 1, effectiveFrom: "2025-01-01" },
  { type: "SDL_EMPLOYER", monthlyMaxNgwee: 0, ratePercent: 0.5, effectiveFrom: "2025-01-01" },
];

export function usePayeBands() {
  return useApiQuery<PayeBand[]>(
    () => statutoryService.getPayeBands(),
    [],
    MOCK_PAYE_BANDS,
  );
}

export function useStatutoryCeilings() {
  return useApiQuery<StatutoryCeiling[]>(
    () => statutoryService.getCeilings(),
    [],
    MOCK_CEILINGS,
  );
}

export function usePayrollCalculation() {
  return useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vars: any) => statutoryService.calculate(vars as PayrollCalculationRequest),
  );
}
