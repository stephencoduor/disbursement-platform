/**
 * DisbursePro — Statutory Calculation Service
 * Implements Zambian 2025 PAYE bands, NAPSA, NHIMA, and SDL calculations.
 *
 * References:
 *   - ZRA PAYE bands effective January 2025
 *   - NAPSA ceiling ZMW 1,708.20/month (Jan 2025)
 *   - NHIMA 1% employee + 1% employer (no ceiling)
 *   - SDL 0.5% employer only
 *
 * All amounts in minor units (ngwee). 100 ngwee = 1 ZMW.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.service;

import com.qsoftwares.dispro.statutory.dto.PayrollCalculationRequest;
import com.qsoftwares.dispro.statutory.dto.PayrollCalculationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class StatutoryCalculationService {

    // PAYE Bands (2025) — monthly thresholds in ngwee
    private static final long PAYE_BAND_1_CEILING = 510_000L;   // ZMW 5,100.00
    private static final long PAYE_BAND_2_CEILING = 710_000L;   // ZMW 7,100.00
    private static final long PAYE_BAND_3_CEILING = 920_000L;   // ZMW 9,200.00
    private static final int PAYE_RATE_1_BPS = 0;
    private static final int PAYE_RATE_2_BPS = 2000;
    private static final int PAYE_RATE_3_BPS = 3000;
    private static final int PAYE_RATE_4_BPS = 3700;

    // NAPSA — 5% EE + 5% ER, ceiling ZMW 1,708.20/month
    private static final int NAPSA_RATE_BPS = 500;
    private static final long NAPSA_CEILING_MINOR = 170_820L;

    // NHIMA — 1% EE + 1% ER, no ceiling
    private static final int NHIMA_RATE_BPS = 100;

    // SDL — 0.5% employer only
    private static final int SDL_RATE_BPS = 50;

    public PayrollCalculationResponse calculate(PayrollCalculationRequest request) {
        long gross = request.getGrossSalaryMinor();
        String period = request.getPeriodMonth() != null ? request.getPeriodMonth()
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        log.info("Calculating statutory deductions: gross={} ngwee, period={}", gross, period);

        long paye = calculatePaye(gross);
        long napsaEe = calculateNapsa(gross);
        long napsaEr = calculateNapsa(gross);
        long nhimaEe = applyRate(gross, NHIMA_RATE_BPS);
        long nhimaEr = applyRate(gross, NHIMA_RATE_BPS);
        long sdl = applyRate(gross, SDL_RATE_BPS);

        long totalEeDeductions = paye + napsaEe + nhimaEe;
        long net = gross - totalEeDeductions;
        long totalErCost = napsaEr + nhimaEr + sdl;

        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("paye_bands", getPayeBandBreakdown(gross));
        breakdown.put("napsa_ceiling_zmw", "1,708.20");
        breakdown.put("napsa_rate", "5% EE + 5% ER");
        breakdown.put("nhima_rate", "1% EE + 1% ER");
        breakdown.put("sdl_rate", "0.5% ER");

        return PayrollCalculationResponse.builder()
                .currencyCode(request.getCurrencyCode())
                .periodMonth(period)
                .grossSalaryMinor(gross)
                .netPayMinor(net)
                .payeAmountMinor(paye)
                .napsaEmployeeMinor(napsaEe)
                .napsaEmployerMinor(napsaEr)
                .nhimaEmployeeMinor(nhimaEe)
                .nhimaEmployerMinor(nhimaEr)
                .sdlMinor(sdl)
                .totalEmployeeDeductionsMinor(totalEeDeductions)
                .totalEmployerCostMinor(totalErCost)
                .breakdown(breakdown)
                .build();
    }

    private long calculatePaye(long gross) {
        long paye = 0;
        if (gross > PAYE_BAND_3_CEILING) {
            paye += applyRate(gross - PAYE_BAND_3_CEILING, PAYE_RATE_4_BPS);
            paye += applyRate(PAYE_BAND_3_CEILING - PAYE_BAND_2_CEILING, PAYE_RATE_3_BPS);
            paye += applyRate(PAYE_BAND_2_CEILING - PAYE_BAND_1_CEILING, PAYE_RATE_2_BPS);
        } else if (gross > PAYE_BAND_2_CEILING) {
            paye += applyRate(gross - PAYE_BAND_2_CEILING, PAYE_RATE_3_BPS);
            paye += applyRate(PAYE_BAND_2_CEILING - PAYE_BAND_1_CEILING, PAYE_RATE_2_BPS);
        } else if (gross > PAYE_BAND_1_CEILING) {
            paye += applyRate(gross - PAYE_BAND_1_CEILING, PAYE_RATE_2_BPS);
        }
        return paye;
    }

    private long calculateNapsa(long gross) {
        long contribution = applyRate(gross, NAPSA_RATE_BPS);
        return Math.min(contribution, NAPSA_CEILING_MINOR);
    }

    private long applyRate(long amount, int rateBps) {
        return (amount * rateBps) / 10_000L;
    }

    public List<Map<String, Object>> getPayeBands() {
        return List.of(
                Map.of("band", 1, "lowerZmw", "0.00", "upperZmw", "5,100.00", "ratePct", "0%", "rateBps", PAYE_RATE_1_BPS),
                Map.of("band", 2, "lowerZmw", "5,100.01", "upperZmw", "7,100.00", "ratePct", "20%", "rateBps", PAYE_RATE_2_BPS),
                Map.of("band", 3, "lowerZmw", "7,100.01", "upperZmw", "9,200.00", "ratePct", "30%", "rateBps", PAYE_RATE_3_BPS),
                Map.of("band", 4, "lowerZmw", "9,200.01", "upperZmw", "No limit", "ratePct", "37%", "rateBps", PAYE_RATE_4_BPS)
        );
    }

    public Map<String, Object> getCeilings() {
        return Map.of(
                "napsa", Map.of("rateEeBps", NAPSA_RATE_BPS, "rateErBps", NAPSA_RATE_BPS,
                        "ceilingMinor", NAPSA_CEILING_MINOR, "ceilingZmw", "1,708.20"),
                "nhima", Map.of("rateEeBps", NHIMA_RATE_BPS, "rateErBps", NHIMA_RATE_BPS, "ceiling", "none"),
                "sdl", Map.of("rateErBps", SDL_RATE_BPS, "ceiling", "none"),
                "effectiveFrom", "2025-01-01",
                "country", "ZM",
                "currency", "ZMW"
        );
    }

    private List<Map<String, Object>> getPayeBandBreakdown(long gross) {
        return List.of(
                Map.of("band", 1, "taxableMinor", Math.min(gross, PAYE_BAND_1_CEILING), "taxMinor", 0L),
                Map.of("band", 2, "taxableMinor", Math.max(0, Math.min(gross, PAYE_BAND_2_CEILING) - PAYE_BAND_1_CEILING),
                        "taxMinor", applyRate(Math.max(0, Math.min(gross, PAYE_BAND_2_CEILING) - PAYE_BAND_1_CEILING), PAYE_RATE_2_BPS)),
                Map.of("band", 3, "taxableMinor", Math.max(0, Math.min(gross, PAYE_BAND_3_CEILING) - PAYE_BAND_2_CEILING),
                        "taxMinor", applyRate(Math.max(0, Math.min(gross, PAYE_BAND_3_CEILING) - PAYE_BAND_2_CEILING), PAYE_RATE_3_BPS)),
                Map.of("band", 4, "taxableMinor", Math.max(0, gross - PAYE_BAND_3_CEILING),
                        "taxMinor", applyRate(Math.max(0, gross - PAYE_BAND_3_CEILING), PAYE_RATE_4_BPS))
        );
    }
}
