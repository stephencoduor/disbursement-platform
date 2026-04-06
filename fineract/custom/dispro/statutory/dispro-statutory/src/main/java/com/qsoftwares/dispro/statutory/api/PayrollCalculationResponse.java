/**
 * DisbursePro — Payroll Calculation Response DTO
 * Statutory tax breakdown: PAYE, NAPSA, NHIMA, SDL — all amounts in minor units (ngwee).
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollCalculationResponse {

    /** Gross monthly salary in minor units (ngwee) */
    private long grossSalary;

    /** Net pay after all employee deductions, in minor units (ngwee) */
    private long netPay;

    /** PAYE (Pay As You Earn) income tax, in minor units */
    private long payeAmount;

    /** NAPSA employee contribution (5%), in minor units */
    private long napsaEmployee;

    /** NAPSA employer contribution (5%), in minor units */
    private long napsaEmployer;

    /** NHIMA employee contribution (1%), in minor units */
    private long nhimaEmployee;

    /** NHIMA employer contribution (1%), in minor units */
    private long nhimaEmployer;

    /** Skills Development Levy (0.5%), employer only, in minor units */
    private long sdl;

    /** ISO 4217 currency code */
    private String currencyCode;

    /** Engine version for audit trail */
    private String engineVersion;

    /** Detailed breakdown map (band-by-band PAYE, each statutory line) */
    private Map<String, Object> breakdown;
}
