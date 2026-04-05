/**
 * DisbursePro — Fee Calculation Service
 * Calculates platform fees, carrier fees, and government levies for Zambian mobile money disbursements.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.disbursement.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
public class FeeCalculationService {

    /** Platform fee: 1% of net amount */
    private static final BigDecimal PLATFORM_FEE_RATE = new BigDecimal("0.01");

    /** Levy threshold: ZMW 0.50 for amounts exceeding ZMW 5,000 */
    private static final BigDecimal LEVY_THRESHOLD = new BigDecimal("5000.00");
    private static final BigDecimal LEVY_AMOUNT = new BigDecimal("0.50");

    // Carrier withdrawal fee rates
    private static final BigDecimal AIRTEL_WITHDRAWAL_RATE = new BigDecimal("0.025");   // 2.5%
    private static final BigDecimal AIRTEL_PURCHASE_RATE = new BigDecimal("0.005");     // 0.5%
    private static final BigDecimal MTN_WITHDRAWAL_RATE = new BigDecimal("0.020");       // 2.0%
    private static final BigDecimal MTN_PURCHASE_RATE = new BigDecimal("0.004");         // 0.4%
    private static final BigDecimal ZAMTEL_WITHDRAWAL_RATE = new BigDecimal("0.015");    // 1.5%
    private static final BigDecimal ZAMTEL_PURCHASE_RATE = new BigDecimal("0.003");      // 0.3%

    /**
     * Calculate the complete fee breakdown for a disbursement.
     *
     * @param netAmount the amount the employee receives (ZMW)
     * @param carrier   the mobile money carrier (AIRTEL, MTN, ZAMTEL)
     * @return breakdown with netAmount, carrierFee, platformFee, levy, grossAmount
     */
    public Map<String, Object> calculateFees(BigDecimal netAmount, String carrier) {
        BigDecimal carrierFee = calculateCarrierFee(netAmount, carrier);
        BigDecimal platformFee = netAmount.multiply(PLATFORM_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal levy = netAmount.compareTo(LEVY_THRESHOLD) > 0 ? LEVY_AMOUNT : BigDecimal.ZERO;
        BigDecimal grossAmount = netAmount.add(carrierFee).add(platformFee).add(levy);

        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("netAmount", netAmount.setScale(2, RoundingMode.HALF_UP));
        breakdown.put("carrierFee", carrierFee);
        breakdown.put("carrierWithdrawalRate", getWithdrawalRate(carrier));
        breakdown.put("carrierPurchaseRate", getPurchaseRate(carrier));
        breakdown.put("platformFee", platformFee);
        breakdown.put("platformFeeRate", PLATFORM_FEE_RATE);
        breakdown.put("levy", levy);
        breakdown.put("levyThreshold", LEVY_THRESHOLD);
        breakdown.put("grossAmount", grossAmount);
        breakdown.put("currency", "ZMW");
        breakdown.put("carrier", carrier.toUpperCase());

        log.debug("Fee calculation: net=ZMW {}, carrier={}, carrierFee={}, platformFee={}, levy={}, gross=ZMW {}",
                netAmount, carrier, carrierFee, platformFee, levy, grossAmount);

        return breakdown;
    }

    /**
     * Get fee breakdown for an existing disbursement by ID.
     * Stub: returns mock fee data for the given disbursement.
     */
    public Map<String, Object> getFeeBreakdownForDisbursement(String disbursementId) {
        // Stub: use a sample amount and carrier
        BigDecimal sampleAmount = new BigDecimal("8500.00");
        String sampleCarrier = "AIRTEL";

        Map<String, Object> fees = calculateFees(sampleAmount, sampleCarrier);
        fees.put("disbursementId", disbursementId);
        return fees;
    }

    /**
     * Calculate carrier fee based on withdrawal rate (B2C disbursement).
     */
    private BigDecimal calculateCarrierFee(BigDecimal amount, String carrier) {
        BigDecimal rate = getWithdrawalRate(carrier);
        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal getWithdrawalRate(String carrier) {
        return switch (carrier.toUpperCase()) {
            case "AIRTEL" -> AIRTEL_WITHDRAWAL_RATE;
            case "MTN" -> MTN_WITHDRAWAL_RATE;
            case "ZAMTEL" -> ZAMTEL_WITHDRAWAL_RATE;
            default -> AIRTEL_WITHDRAWAL_RATE;
        };
    }

    private BigDecimal getPurchaseRate(String carrier) {
        return switch (carrier.toUpperCase()) {
            case "AIRTEL" -> AIRTEL_PURCHASE_RATE;
            case "MTN" -> MTN_PURCHASE_RATE;
            case "ZAMTEL" -> ZAMTEL_PURCHASE_RATE;
            default -> AIRTEL_PURCHASE_RATE;
        };
    }
}
