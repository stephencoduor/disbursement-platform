/**
 * DisbursePro — Payroll Calculation Request DTO
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollCalculationRequest {

    /** Gross monthly salary in minor units (ngwee). 100 ngwee = 1 ZMW. */
    private long grossSalaryMinor;

    /** ISO 4217 currency code — defaults to ZMW. */
    @Builder.Default
    private String currencyCode = "ZMW";

    /** Optional: override calculation period (YYYY-MM). Defaults to current month. */
    private String periodMonth;
}
