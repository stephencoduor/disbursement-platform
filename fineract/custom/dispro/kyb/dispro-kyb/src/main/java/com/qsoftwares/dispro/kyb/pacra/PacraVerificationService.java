/**
 * DisbursePro — PACRA Verification Service
 * Integrates with Zambia Patent & Companies Registration Agency (PACRA)
 * for real-time company verification, director lookups, and annual return status.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.kyb.pacra;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class PacraVerificationService {

    @Value("${dispro.pacra.api-key:sandbox_key}")
    private String apiKey;

    @Value("${dispro.pacra.base-url:https://api.pacra.org.zm}")
    private String baseUrl;

    // Zambian company registration number format: e.g. 120150012345
    private static final String REG_NUMBER_PATTERN = "^\\d{12}$";

    /**
     * Verify a company against PACRA registry.
     * In production, calls PACRA REST API. Stub returns realistic mock data.
     */
    public Map<String, Object> verifyCompany(String registrationNumber) {
        log.info("PACRA verification for reg# {}", registrationNumber);

        // Stub — simulate PACRA API response
        boolean valid = registrationNumber != null && registrationNumber.matches(REG_NUMBER_PATTERN);
        String status = valid ? "ACTIVE" : "NOT_FOUND";

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("registrationNumber", registrationNumber);
        result.put("status", status);
        result.put("verified", valid);

        if (valid) {
            result.put("companyName", "Copperbelt Transport Services Ltd");
            result.put("companyType", "PRIVATE_LIMITED");
            result.put("incorporationDate", "2018-03-15");
            result.put("registeredOffice", "Plot 2345, Cairo Road, Lusaka");
            result.put("annualReturnDue", LocalDate.now().getYear() + "-06-30");
            result.put("annualReturnFiled", LocalDate.now().getYear() > 2025);
            result.put("directors", List.of(
                Map.of("name", "Bwalya Mulenga", "role", "DIRECTOR", "nationality", "ZAMBIAN", "idNumber", "123456/78/1"),
                Map.of("name", "Chanda Kapasa", "role", "SECRETARY", "nationality", "ZAMBIAN", "idNumber", "234567/89/1")
            ));
            result.put("shareholders", List.of(
                Map.of("name", "Bwalya Mulenga", "shares", 60, "class", "ORDINARY"),
                Map.of("name", "Chanda Kapasa", "shares", 40, "class", "ORDINARY")
            ));
        }

        result.put("verifiedAt", java.time.Instant.now().toString());
        return result;
    }

    /**
     * Check annual return filing status with PACRA.
     */
    public Map<String, Object> checkAnnualReturn(String registrationNumber) {
        log.info("Checking annual return status for {}", registrationNumber);
        int currentYear = LocalDate.now().getYear();
        return Map.of(
            "registrationNumber", registrationNumber,
            "currentYear", currentYear,
            "filingDeadline", currentYear + "-06-30",
            "filed", false,
            "lastFiledYear", currentYear - 1,
            "penalty", false,
            "penaltyAmount", 0
        );
    }

    /**
     * Trigger annual refresh of KYB data from PACRA.
     * Called by scheduler or manually via admin API.
     */
    public Map<String, Object> triggerAnnualRefresh(String registrationNumber) {
        log.info("Triggering annual KYB refresh for {}", registrationNumber);
        Map<String, Object> verification = verifyCompany(registrationNumber);
        // In production: compare with stored data, flag changes, update DB
        Map<String, Object> result = new LinkedHashMap<>(verification);
        result.put("refreshTriggered", true);
        result.put("changesDetected", false);
        result.put("nextRefreshDue", LocalDate.now().plusYears(1).toString());
        return result;
    }
}
