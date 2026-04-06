/**
 * DisbursePro — Payroll Calculation Request DTO
 * Input for statutory tax calculation: gross salary in minor units (ngwee).
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.api;

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
    private long grossSalary;

    /** ISO 4217 currency code. Defaults to ZMW if not provided. */
    private String currencyCode;
}
