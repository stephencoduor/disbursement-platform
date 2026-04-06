/**
 * DisbursePro — Payroll Calculation Response DTO
 * All amounts in minor units (ngwee). 100 ngwee = 1 ZMW.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.dto;

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

    private String currencyCode;
    private String periodMonth;

    /** Gross salary input */
    private long grossSalaryMinor;

    /** Net take-home after all deductions */
    private long netPayMinor;

    /** PAYE (Pay As You Earn) income tax */
    private long payeAmountMinor;

    /** NAPSA employee contribution (5%) */
    private long napsaEmployeeMinor;

    /** NAPSA employer contribution (5%, capped at ceiling) */
    private long napsaEmployerMinor;

    /** NHIMA employee contribution (1%) */
    private long nhimaEmployeeMinor;

    /** NHIMA employer contribution (1%) */
    private long nhimaEmployerMinor;

    /** SDL — Skills Development Levy (0.5%, employer only) */
    private long sdlMinor;

    /** Total employee deductions (PAYE + NAPSA EE + NHIMA EE) */
    private long totalEmployeeDeductionsMinor;

    /** Total employer cost (NAPSA ER + NHIMA ER + SDL) */
    private long totalEmployerCostMinor;

    /** Detailed breakdown for display */
    private Map<String, Object> breakdown;

    /** Calculation engine version identifier */
    @Builder.Default
    private String engineVersion = "dispro-statutory-v1-2025";
}
