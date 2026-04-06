/**
 * DisbursePro — Statutory Calculation Service
 * Implements 2025 Zambian statutory deductions: PAYE, NAPSA, NHIMA, SDL.
 * All monetary values in minor units (ngwee, 100 ngwee = 1 ZMW).
 * All rates in basis points (10000 bps = 100%).
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.service;

import com.qsoftwares.dispro.statutory.api.PayrollCalculationRequest;
import com.qsoftwares.dispro.statutory.api.PayrollCalculationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class StatutoryCalculationService {

    public static final String ENGINE_VERSION = "ZM-2025-v1";
    public static final String DEFAULT_CURRENCY = "ZMW";

    // ── PAYE Bands (2025 Zambian rates, monthly, in minor units / ngwee) ──
    // Band 1: 0% on first ZMW 5,100 (510_000 ngwee)
    // Band 2: 20% on ZMW 5,100 – 7,100 (510_000 – 710_000 ngwee)
    // Band 3: 30% on ZMW 7,100 – 9,200 (710_000 – 920_000 ngwee)
    // Band 4: 37% on above ZMW 9,200 (above 920_000 ngwee)

    private static final long[][] PAYE_BANDS = {
            // { lowerBoundNgwee, upperBoundNgwee (Long.MAX_VALUE = no cap), rateBps }
            {0L, 510_000L, 0},
            {510_000L, 710_000L, 2000},
            {710_000L, 920_000L, 3000},
            {920_000L, Long.MAX_VALUE, 3700},
    };

    // ── NAPSA: 5% employee + 5% employer, ceiling ZMW 1,708.20 = 170_820 ngwee ──
    private static final int NAPSA_RATE_BPS = 500;          // 5%
    private static final long NAPSA_CEILING_NGWEE = 170_820L; // ZMW 1,708.20

    // ── NHIMA: 1% employee + 1% employer, no ceiling ──
    private static final int NHIMA_RATE_BPS = 100;           // 1%

    // ── SDL: 0.5% gross payroll, employer only ──
    private static final int SDL_RATE_BPS = 50;              // 0.5%

    /**
     * Calculate full statutory breakdown for a gross monthly salary.
     *
     * @param request gross salary in ngwee + currency code
     * @return complete breakdown with net pay
     */
    public PayrollCalculationResponse calculate(PayrollCalculationRequest request) {
        long gross = request.getGrossSalary();
        String currency = request.getCurrencyCode() != null ? request.getCurrencyCode() : DEFAULT_CURRENCY;

        // 1. NAPSA (capped)
        long napsaBase = Math.min(gross, NAPSA_CEILING_NGWEE);
        long napsaEmployee = applyBps(napsaBase, NAPSA_RATE_BPS);
        long napsaEmployer = applyBps(napsaBase, NAPSA_RATE_BPS);

        // 2. NHIMA (no ceiling)
        long nhimaEmployee = applyBps(gross, NHIMA_RATE_BPS);
        long nhimaEmployer = applyBps(gross, NHIMA_RATE_BPS);

        // 3. SDL (employer only)
        long sdl = applyBps(gross, SDL_RATE_BPS);

        // 4. PAYE — taxable income = gross minus NAPSA employee and NHIMA employee
        long taxableIncome = gross - napsaEmployee - nhimaEmployee;
        if (taxableIncome < 0) {
            taxableIncome = 0;
        }

        long payeAmount = 0;
        List<Map<String, Object>> payeBands = new ArrayList<>();
        long remaining = taxableIncome;

        for (long[] band : PAYE_BANDS) {
            long lower = band[0];
            long upper = band[1];
            int rateBps = (int) band[2];

            long bandWidth = (upper == Long.MAX_VALUE) ? remaining : (upper - lower);
            long taxableInBand = Math.min(remaining, bandWidth);
            if (taxableInBand <= 0) {
                break;
            }

            long taxForBand = applyBps(taxableInBand, rateBps);
            payeAmount += taxForBand;
            remaining -= taxableInBand;

            Map<String, Object> bandDetail = new LinkedHashMap<>();
            bandDetail.put("lowerBoundNgwee", lower);
            bandDetail.put("upperBoundNgwee", upper == Long.MAX_VALUE ? null : upper);
            bandDetail.put("rateBps", rateBps);
            bandDetail.put("taxableAmountNgwee", taxableInBand);
            bandDetail.put("taxNgwee", taxForBand);
            payeBands.add(bandDetail);
        }

        // 5. Net pay = gross - PAYE - NAPSA(EE) - NHIMA(EE)
        long netPay = gross - payeAmount - napsaEmployee - nhimaEmployee;

        // Build breakdown map
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("payeBands", payeBands);
        breakdown.put("taxableIncomeNgwee", taxableIncome);
        breakdown.put("totalEmployeeDeductionsNgwee", payeAmount + napsaEmployee + nhimaEmployee);
        breakdown.put("totalEmployerContributionsNgwee", napsaEmployer + nhimaEmployer + sdl);

        log.info("Statutory calculation: gross={} ngwee, paye={}, napsaEE={}, nhimaEE={}, net={}, currency={}",
                gross, payeAmount, napsaEmployee, nhimaEmployee, netPay, currency);

        return PayrollCalculationResponse.builder()
                .grossSalary(gross)
                .netPay(netPay)
                .payeAmount(payeAmount)
                .napsaEmployee(napsaEmployee)
                .napsaEmployer(napsaEmployer)
                .nhimaEmployee(nhimaEmployee)
                .nhimaEmployer(nhimaEmployer)
                .sdl(sdl)
                .currencyCode(currency)
                .engineVersion(ENGINE_VERSION)
                .breakdown(breakdown)
                .build();
    }

    /**
     * Return current PAYE bands as a list of maps.
     */
    public List<Map<String, Object>> getPayeBands() {
        List<Map<String, Object>> bands = new ArrayList<>();
        for (long[] band : PAYE_BANDS) {
            Map<String, Object> b = new LinkedHashMap<>();
            b.put("lowerBoundNgwee", band[0]);
            b.put("upperBoundNgwee", band[1] == Long.MAX_VALUE ? null : band[1]);
            b.put("rateBps", (int) band[2]);
            b.put("ratePercent", String.format("%.1f%%", band[2] / 100.0));
            b.put("lowerBoundZmw", String.format("%.2f", band[0] / 100.0));
            b.put("upperBoundZmw", band[1] == Long.MAX_VALUE ? "No limit" : String.format("%.2f", band[1] / 100.0));
            bands.add(b);
        }
        return bands;
    }

    /**
     * Return statutory ceilings and rates for NAPSA, NHIMA, SDL.
     */
    public Map<String, Object> getCeilings() {
        Map<String, Object> result = new LinkedHashMap<>();

        Map<String, Object> napsa = new LinkedHashMap<>();
        napsa.put("scheme", "NAPSA");
        napsa.put("employeeRateBps", NAPSA_RATE_BPS);
        napsa.put("employerRateBps", NAPSA_RATE_BPS);
        napsa.put("ceilingNgwee", NAPSA_CEILING_NGWEE);
        napsa.put("ceilingZmw", "1708.20");
        napsa.put("description", "National Pension Scheme Authority — 5% EE + 5% ER, ceiling ZMW 1,708.20/month");
        result.put("napsa", napsa);

        Map<String, Object> nhima = new LinkedHashMap<>();
        nhima.put("scheme", "NHIMA");
        nhima.put("employeeRateBps", NHIMA_RATE_BPS);
        nhima.put("employerRateBps", NHIMA_RATE_BPS);
        nhima.put("ceilingNgwee", null);
        nhima.put("description", "National Health Insurance Management Authority — 1% EE + 1% ER, no ceiling");
        result.put("nhima", nhima);

        Map<String, Object> sdlMap = new LinkedHashMap<>();
        sdlMap.put("scheme", "SDL");
        sdlMap.put("employeeRateBps", 0);
        sdlMap.put("employerRateBps", SDL_RATE_BPS);
        sdlMap.put("ceilingNgwee", null);
        sdlMap.put("description", "Skills Development Levy — 0.5% of gross payroll, employer only");
        result.put("sdl", sdlMap);

        result.put("effectiveFrom", "2025-01-01");
        result.put("countryCode", "ZM");
        result.put("currency", DEFAULT_CURRENCY);

        return result;
    }

    /**
     * Apply basis points to an amount.
     * bps=500 means 5%, bps=100 means 1%, etc.
     */
    private long applyBps(long amountNgwee, int bps) {
        return (amountNgwee * bps) / 10_000L;
    }
}
