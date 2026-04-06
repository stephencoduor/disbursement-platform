/**
 * DisbursePro — Disbursement Retry Policy
 * Implements the 2-attempt retry on preferred carrier then failover strategy.
 * Integrates with CarrierRouter and CarrierHealthMonitor for intelligent routing.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.mobilemoney.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RetryPolicy {

    private final CarrierRouter carrierRouter;
    private final CarrierHealthMonitor healthMonitor;

    private static final int MAX_RETRIES_PREFERRED = 2;
    private static final long RETRY_DELAY_MS = 3000; // 3 seconds between retries

    /**
     * Execute a disbursement with retry and failover logic.
     *
     * @param msisdn recipient phone number
     * @param amountNgwee amount in ngwee (ZMW minor units)
     * @param reference transaction reference
     * @return disbursement result with routing details
     */
    public Map<String, Object> executeWithRetry(String msisdn, long amountNgwee, String reference) {
        CarrierRouter.RoutingDecision decision = carrierRouter.route(msisdn, amountNgwee);
        String preferredCarrier = decision.carrier();

        log.info("Retry policy: msisdn={}, preferred={}, health={}", msisdn, preferredCarrier, decision.healthScore());

        // Attempt 1 & 2 on preferred carrier
        for (int attempt = 1; attempt <= MAX_RETRIES_PREFERRED; attempt++) {
            Map<String, Object> result = attemptDisbursement(preferredCarrier, msisdn, amountNgwee, reference, attempt);
            if ("SUCCESS".equals(result.get("status"))) {
                healthMonitor.recordOutcome(preferredCarrier, true, (long) result.getOrDefault("latencyMs", 0L));
                result.put("carrier", preferredCarrier);
                result.put("failover", false);
                result.put("attempts", attempt);
                return result;
            }
            healthMonitor.recordOutcome(preferredCarrier, false, (long) result.getOrDefault("latencyMs", 0L));
            log.warn("Attempt {}/{} failed on {}: {}", attempt, MAX_RETRIES_PREFERRED, preferredCarrier, result.get("error"));
        }

        // Failover: try alternate carrier
        String alternateCarrier = carrierRouter.selectAlternate(preferredCarrier);
        if (alternateCarrier != null) {
            log.info("Failover from {} to {}", preferredCarrier, alternateCarrier);
            Map<String, Object> result = attemptDisbursement(alternateCarrier, msisdn, amountNgwee, reference, 1);
            if ("SUCCESS".equals(result.get("status"))) {
                healthMonitor.recordOutcome(alternateCarrier, true, (long) result.getOrDefault("latencyMs", 0L));
                result.put("carrier", alternateCarrier);
                result.put("failover", true);
                result.put("failedCarrier", preferredCarrier);
                result.put("attempts", MAX_RETRIES_PREFERRED + 1);
                return result;
            }
            healthMonitor.recordOutcome(alternateCarrier, false, (long) result.getOrDefault("latencyMs", 0L));
        }

        // All attempts failed
        Map<String, Object> failure = new LinkedHashMap<>();
        failure.put("status", "FAILED");
        failure.put("error", "All carriers exhausted after " + (MAX_RETRIES_PREFERRED + 1) + " attempts");
        failure.put("preferredCarrier", preferredCarrier);
        failure.put("alternateCarrier", alternateCarrier);
        failure.put("attempts", MAX_RETRIES_PREFERRED + 1);
        failure.put("msisdn", msisdn);
        failure.put("amountNgwee", amountNgwee);
        return failure;
    }

    /**
     * Stub disbursement attempt. In production, calls carrier API.
     */
    private Map<String, Object> attemptDisbursement(String carrier, String msisdn, long amountNgwee, String reference, int attempt) {
        long start = System.currentTimeMillis();

        // Simulate: 95% success rate
        boolean success = new Random().nextInt(100) < 95;
        long latency = 500 + new Random().nextInt(2000);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("latencyMs", latency);

        if (success) {
            result.put("status", "SUCCESS");
            result.put("transactionId", "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            result.put("carrierRef", carrier + "-" + System.currentTimeMillis());
        } else {
            result.put("status", "FAILED");
            result.put("error", "Carrier timeout on attempt " + attempt);
        }

        return result;
    }
}
