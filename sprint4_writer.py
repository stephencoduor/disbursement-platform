#!/usr/bin/env python3
"""DisbursePro Sprint 4 — KYB Live (PACRA integration, sanctions screening, annual refresh)
+ Wallet Top-Up (virtual account listener, card top-up, NFS flow)."""
import os

CUSTOM = r"D:\disbursement-platform\fineract\custom\dispro"
PROVIDER_CHANGELOG = r"D:\disbursement-platform\fineract\fineract-provider\src\main\resources\db\changelog\tenant\parts"
SRC = r"D:\disbursement-platform\src"

files = {}

# ═══════════════════════════════════════════════════════════════════════════════
# 1. KYB Live — PACRA Integration + Sanctions Screening + Annual Refresh
# ═══════════════════════════════════════════════════════════════════════════════

kyb_base = os.path.join(CUSTOM, "kyb", "dispro-kyb", "src", "main", "java", "com", "qsoftwares", "dispro", "kyb")

files[os.path.join(kyb_base, "pacra", "PacraVerificationService.java")] = r'''/**
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
'''

files[os.path.join(kyb_base, "sanctions", "SanctionsScreeningService.java")] = r'''/**
 * DisbursePro — Sanctions Screening Service
 * Screens employers and directors against OFAC SDN, UN-1267, EU CFSP,
 * Bank of Zambia (BoZ) restricted list, and local PEP lists.
 * Uses fuzzy name matching (Jaro-Winkler) with configurable threshold.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.kyb.sanctions;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SanctionsScreeningService {

    private static final double MATCH_THRESHOLD = 0.85;

    // In-memory sanctions list — production would use DB + scheduled refresh
    private final Map<String, List<SanctionEntry>> sanctionsLists = new ConcurrentHashMap<>();
    private Instant lastRefresh = Instant.now();

    public SanctionsScreeningService() {
        // Seed with sample entries for testing
        seedSampleData();
    }

    /**
     * Screen an individual or entity against all loaded sanctions lists.
     */
    public ScreeningResult screen(String name, String nationality, String idNumber) {
        log.info("Screening: name={}, nationality={}, id={}", name, nationality, idNumber);
        String normalizedName = normalizeName(name);
        List<SanctionMatch> matches = new ArrayList<>();

        for (var entry : sanctionsLists.entrySet()) {
            String listName = entry.getKey();
            for (SanctionEntry sanctioned : entry.getValue()) {
                double score = jaroWinklerSimilarity(normalizedName, normalizeName(sanctioned.name()));
                if (score >= MATCH_THRESHOLD) {
                    matches.add(new SanctionMatch(listName, sanctioned.name(), sanctioned.type(),
                        sanctioned.reason(), score, sanctioned.listedDate()));
                }
                // Also check ID number exact match
                if (idNumber != null && idNumber.equals(sanctioned.idNumber())) {
                    matches.add(new SanctionMatch(listName, sanctioned.name(), "ID_MATCH",
                        "Exact ID match: " + idNumber, 1.0, sanctioned.listedDate()));
                }
            }
        }

        String status = matches.isEmpty() ? "CLEAR" : (matches.stream().anyMatch(m -> m.score() >= 0.95) ? "BLOCKED" : "REVIEW");
        return new ScreeningResult(name, status, matches, Instant.now());
    }

    /**
     * Screen all directors of an employer.
     */
    public List<ScreeningResult> screenDirectors(List<Map<String, String>> directors) {
        return directors.stream()
            .map(d -> screen(d.getOrDefault("name", ""), d.getOrDefault("nationality", ""), d.getOrDefault("idNumber", null)))
            .toList();
    }

    /**
     * Refresh sanctions lists from external sources.
     * In production: downloads from OFAC, UN, EU, BoZ feeds.
     */
    @Scheduled(cron = "0 0 2 * * *") // Daily at 2am
    public void refreshLists() {
        log.info("Refreshing sanctions lists...");
        seedSampleData(); // Stub — would fetch from APIs
        lastRefresh = Instant.now();
        log.info("Sanctions lists refreshed at {}", lastRefresh);
    }

    public Map<String, Object> getListStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        for (var entry : sanctionsLists.entrySet()) {
            stats.put(entry.getKey(), Map.of("entries", entry.getValue().size()));
        }
        stats.put("lastRefresh", lastRefresh.toString());
        stats.put("matchThreshold", MATCH_THRESHOLD);
        return stats;
    }

    // ─── Jaro-Winkler similarity ──────────────────────────────────────────────

    private double jaroWinklerSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0;
        if (s1.equals(s2)) return 1.0;

        int len1 = s1.length(), len2 = s2.length();
        int maxDist = Math.max(len1, len2) / 2 - 1;
        if (maxDist < 0) maxDist = 0;

        boolean[] match1 = new boolean[len1];
        boolean[] match2 = new boolean[len2];
        int matches = 0;
        int transpositions = 0;

        for (int i = 0; i < len1; i++) {
            int start = Math.max(0, i - maxDist);
            int end = Math.min(i + maxDist + 1, len2);
            for (int j = start; j < end; j++) {
                if (match2[j] || s1.charAt(i) != s2.charAt(j)) continue;
                match1[i] = true;
                match2[j] = true;
                matches++;
                break;
            }
        }

        if (matches == 0) return 0;

        int k = 0;
        for (int i = 0; i < len1; i++) {
            if (!match1[i]) continue;
            while (!match2[k]) k++;
            if (s1.charAt(i) != s2.charAt(k)) transpositions++;
            k++;
        }

        double jaro = ((double) matches / len1 + (double) matches / len2 +
            (double) (matches - transpositions / 2) / matches) / 3.0;

        // Winkler modification — bonus for common prefix
        int prefix = 0;
        for (int i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
            if (s1.charAt(i) == s2.charAt(i)) prefix++;
            else break;
        }
        return jaro + prefix * 0.1 * (1 - jaro);
    }

    private String normalizeName(String name) {
        if (name == null) return "";
        return name.toUpperCase().replaceAll("[^A-Z ]", "").replaceAll("\\s+", " ").trim();
    }

    private void seedSampleData() {
        sanctionsLists.put("OFAC_SDN", List.of(
            new SanctionEntry("AHMED HASSAN MOHAMED", "INDIVIDUAL", "Terrorism financing", null, "2019-03-15"),
            new SanctionEntry("GLOBAL TRADING ENTERPRISES", "ENTITY", "Sanctions evasion", null, "2021-08-22")
        ));
        sanctionsLists.put("UN_1267", List.of(
            new SanctionEntry("AL-RASHID FOUNDATION", "ENTITY", "ISIL/Al-Qaeda support", null, "2020-01-10")
        ));
        sanctionsLists.put("BOZ_RESTRICTED", List.of(
            new SanctionEntry("LUSAKA FOREX BUREAU LTD", "ENTITY", "License revoked - money laundering", null, "2024-06-01")
        ));
        sanctionsLists.put("PEP_ZAMBIA", List.of(
            new SanctionEntry("JOHN BANDA", "PEP", "Member of Parliament - Lusaka Central", "123456/78/1", "2023-01-01"),
            new SanctionEntry("GRACE MWILA", "PEP", "Permanent Secretary - Ministry of Finance", null, "2023-01-01")
        ));
    }

    // ─── Records ──────────────────────────────────────────────────────────────

    public record SanctionEntry(String name, String type, String reason, String idNumber, String listedDate) {}
    public record SanctionMatch(String list, String matchedName, String type, String reason, double score, String listedDate) {}
    public record ScreeningResult(String screenedName, String status, List<SanctionMatch> matches, Instant screenedAt) {}
}
'''

files[os.path.join(kyb_base, "api", "KybLiveApiResource.java")] = r'''/**
 * DisbursePro — KYB Live API
 * Endpoints for PACRA verification, sanctions screening, and annual refresh.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.kyb.api;

import com.qsoftwares.dispro.kyb.pacra.PacraVerificationService;
import com.qsoftwares.dispro.kyb.sanctions.SanctionsScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/dispro/kyb/live")
@RequiredArgsConstructor
public class KybLiveApiResource {

    private final PacraVerificationService pacraService;
    private final SanctionsScreeningService sanctionsService;

    /** Verify company registration with PACRA. */
    @PostMapping("/verify-company")
    public ResponseEntity<?> verifyCompany(@RequestBody Map<String, String> request) {
        String regNumber = request.get("registrationNumber");
        if (regNumber == null || regNumber.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "registrationNumber is required"));
        }
        return ResponseEntity.ok(pacraService.verifyCompany(regNumber));
    }

    /** Check annual return filing status. */
    @GetMapping("/annual-return/{registrationNumber}")
    public ResponseEntity<?> checkAnnualReturn(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(pacraService.checkAnnualReturn(registrationNumber));
    }

    /** Trigger annual KYB refresh. */
    @PostMapping("/annual-refresh")
    public ResponseEntity<?> triggerAnnualRefresh(@RequestBody Map<String, String> request) {
        String regNumber = request.get("registrationNumber");
        return ResponseEntity.ok(pacraService.triggerAnnualRefresh(regNumber));
    }

    /** Screen an individual against sanctions lists. */
    @PostMapping("/screen")
    public ResponseEntity<?> screenIndividual(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(sanctionsService.screen(
            request.getOrDefault("name", ""),
            request.getOrDefault("nationality", ""),
            request.get("idNumber")
        ));
    }

    /** Screen all directors of an employer. */
    @PostMapping("/screen-directors")
    public ResponseEntity<?> screenDirectors(@RequestBody List<Map<String, String>> directors) {
        return ResponseEntity.ok(sanctionsService.screenDirectors(directors));
    }

    /** Get sanctions list statistics. */
    @GetMapping("/sanctions-stats")
    public ResponseEntity<?> getSanctionsStats() {
        return ResponseEntity.ok(sanctionsService.getListStats());
    }
}
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 2. Wallet Top-Up — Virtual account listener, card top-up, NFS flow
# ═══════════════════════════════════════════════════════════════════════════════

wallet_base = os.path.join(CUSTOM, "wallet", "dispro-wallet", "src", "main", "java", "com", "qsoftwares", "dispro", "wallet")

files[os.path.join(wallet_base, "topup", "WalletTopUpService.java")] = r'''/**
 * DisbursePro — Wallet Top-Up Service
 * Handles wallet funding via virtual account deposit, card payment, and NFS (National Financial Switch).
 * Supports Zambian payment channels: Visa/Mastercard (via payment gateway), bank transfer,
 * and mobile money deposit (Airtel/MTN/Zamtel).
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.wallet.topup;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
@Slf4j
public class WalletTopUpService {

    /** Top up via virtual account — employer receives a unique virtual account number. */
    public Map<String, Object> topUpViaVirtualAccount(long employerId, BigDecimal amount, String reference) {
        log.info("Virtual account top-up: employer={}, amount={}, ref={}", employerId, amount, reference);

        String virtualAccountNumber = String.format("VA%06d%04d", employerId, new Random().nextInt(10000));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("employerId", employerId);
        result.put("virtualAccountNumber", virtualAccountNumber);
        result.put("amount", amount);
        result.put("currency", "ZMW");
        result.put("reference", reference);
        result.put("status", "PENDING_DEPOSIT");
        result.put("expiresAt", Instant.now().plusSeconds(86400).toString()); // 24h expiry
        result.put("bankName", "Zanaco PLC");
        result.put("bankBranch", "Cairo Road, Lusaka");
        result.put("instructions", "Deposit ZMW " + amount + " to account " + virtualAccountNumber + " at any Zanaco branch or via internet banking");
        result.put("createdAt", Instant.now().toString());
        return result;
    }

    /** Top up via card payment (Visa/Mastercard via payment gateway). */
    public Map<String, Object> topUpViaCard(long employerId, BigDecimal amount, String cardToken) {
        log.info("Card top-up: employer={}, amount={}, tokenLast4={}", employerId, amount,
            cardToken != null && cardToken.length() >= 4 ? cardToken.substring(cardToken.length() - 4) : "****");

        String txnId = "CTX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("transactionId", txnId);
        result.put("employerId", employerId);
        result.put("amount", amount);
        result.put("currency", "ZMW");
        result.put("channel", "CARD");
        result.put("status", "PROCESSING");
        result.put("cardLast4", cardToken != null && cardToken.length() >= 4 ? cardToken.substring(cardToken.length() - 4) : "****");
        result.put("fee", amount.multiply(new BigDecimal("0.029")).setScale(2, java.math.RoundingMode.HALF_UP)); // 2.9% card fee
        result.put("netAmount", amount.subtract(amount.multiply(new BigDecimal("0.029")).setScale(2, java.math.RoundingMode.HALF_UP)));
        result.put("estimatedSettlement", "T+1");
        result.put("createdAt", Instant.now().toString());
        return result;
    }

    /** Top up via NFS (National Financial Switch) — Zambian interbank transfer. */
    public Map<String, Object> topUpViaNfs(long employerId, BigDecimal amount, String sourceBankCode, String sourceAccountNumber) {
        log.info("NFS top-up: employer={}, amount={}, bank={}", employerId, amount, sourceBankCode);

        String nfsRef = "NFS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Zambian bank lookup
        Map<String, String> bankNames = Map.of(
            "01", "Zanaco PLC",
            "02", "Stanbic Bank Zambia",
            "04", "Barclays Bank Zambia (now ABSA)",
            "06", "Standard Chartered Zambia",
            "09", "Indo Zambia Bank",
            "14", "FNB Zambia",
            "19", "Atlas Mara Zambia",
            "26", "Access Bank Zambia",
            "35", "AB Bank Zambia",
            "37", "First Alliance Bank Zambia"
        );

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("nfsReference", nfsRef);
        result.put("employerId", employerId);
        result.put("amount", amount);
        result.put("currency", "ZMW");
        result.put("channel", "NFS");
        result.put("sourceBank", bankNames.getOrDefault(sourceBankCode, "Unknown Bank"));
        result.put("sourceBankCode", sourceBankCode);
        result.put("sourceAccount", sourceAccountNumber);
        result.put("status", "SUBMITTED");
        result.put("fee", new BigDecimal("15.00")); // Fixed NFS fee
        result.put("estimatedSettlement", "Same day (before 15:00 CAT) or T+1");
        result.put("createdAt", Instant.now().toString());
        return result;
    }

    /** Get wallet balance for an employer. */
    public Map<String, Object> getBalance(long employerId) {
        // Stub — returns mock balance
        return Map.of(
            "employerId", employerId,
            "availableBalance", new BigDecimal("125000.00"),
            "pendingDeposits", new BigDecimal("50000.00"),
            "pendingDisbursements", new BigDecimal("32500.00"),
            "currency", "ZMW",
            "lastUpdated", Instant.now().toString()
        );
    }

    /** Get top-up history for an employer. */
    public List<Map<String, Object>> getTopUpHistory(long employerId) {
        // Stub — returns mock history
        return List.of(
            Map.of("id", 1, "channel", "CARD", "amount", 50000, "status", "COMPLETED", "date", "2026-04-01"),
            Map.of("id", 2, "channel", "NFS", "amount", 75000, "status", "COMPLETED", "date", "2026-03-28"),
            Map.of("id", 3, "channel", "VIRTUAL_ACCOUNT", "amount", 100000, "status", "COMPLETED", "date", "2026-03-15"),
            Map.of("id", 4, "channel", "MOBILE_MONEY", "amount", 25000, "status", "COMPLETED", "date", "2026-03-10"),
            Map.of("id", 5, "channel", "CARD", "amount", 30000, "status", "FAILED", "date", "2026-03-05")
        );
    }
}
'''

files[os.path.join(wallet_base, "api", "WalletTopUpApiResource.java")] = r'''/**
 * DisbursePro — Wallet Top-Up API
 * Endpoints for funding employer wallets via multiple channels.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.wallet.api;

import com.qsoftwares.dispro.wallet.topup.WalletTopUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/v1/dispro/wallet")
@RequiredArgsConstructor
public class WalletTopUpApiResource {

    private final WalletTopUpService topUpService;

    /** Get wallet balance. */
    @GetMapping("/balance/{employerId}")
    public ResponseEntity<?> getBalance(@PathVariable long employerId) {
        return ResponseEntity.ok(topUpService.getBalance(employerId));
    }

    /** Top up via virtual account deposit. */
    @PostMapping("/topup/virtual-account")
    public ResponseEntity<?> topUpViaVirtualAccount(@RequestBody Map<String, Object> request) {
        long employerId = Long.parseLong(request.get("employerId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String reference = (String) request.getOrDefault("reference", "");
        return ResponseEntity.ok(topUpService.topUpViaVirtualAccount(employerId, amount, reference));
    }

    /** Top up via card payment. */
    @PostMapping("/topup/card")
    public ResponseEntity<?> topUpViaCard(@RequestBody Map<String, Object> request) {
        long employerId = Long.parseLong(request.get("employerId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String cardToken = (String) request.getOrDefault("cardToken", "");
        return ResponseEntity.ok(topUpService.topUpViaCard(employerId, amount, cardToken));
    }

    /** Top up via NFS (interbank transfer). */
    @PostMapping("/topup/nfs")
    public ResponseEntity<?> topUpViaNfs(@RequestBody Map<String, Object> request) {
        long employerId = Long.parseLong(request.get("employerId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String bankCode = (String) request.getOrDefault("sourceBankCode", "");
        String accountNumber = (String) request.getOrDefault("sourceAccountNumber", "");
        return ResponseEntity.ok(topUpService.topUpViaNfs(employerId, amount, bankCode, accountNumber));
    }

    /** Get top-up history. */
    @GetMapping("/topup/history/{employerId}")
    public ResponseEntity<?> getTopUpHistory(@PathVariable long employerId) {
        return ResponseEntity.ok(topUpService.getTopUpHistory(employerId));
    }
}
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 3. Liquibase Changelogs
# ═══════════════════════════════════════════════════════════════════════════════

files[os.path.join(PROVIDER_CHANGELOG, "0232_dispro_kyb_live.xml")] = r'''<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                   http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.1.xsd">

    <!-- PACRA Verification Audit -->
    <changeSet id="dispro-pacra-verification" author="qsoftwares">
        <preConditions onFail="MARK_RAN">
            <not><tableExists tableName="m_dispro_pacra_verification"/></not>
        </preConditions>
        <createTable tableName="m_dispro_pacra_verification">
            <column name="id" type="BIGINT" autoIncrement="true"><constraints primaryKey="true"/></column>
            <column name="employer_id" type="BIGINT"><constraints nullable="false"/></column>
            <column name="registration_number" type="VARCHAR(20)"><constraints nullable="false"/></column>
            <column name="company_name" type="VARCHAR(255)"/>
            <column name="company_type" type="VARCHAR(50)"/>
            <column name="status" type="VARCHAR(20)"><constraints nullable="false"/></column>
            <column name="verified" type="BOOLEAN" defaultValueBoolean="false"/>
            <column name="annual_return_filed" type="BOOLEAN" defaultValueBoolean="false"/>
            <column name="directors_json" type="TEXT"/>
            <column name="raw_response" type="TEXT"/>
            <column name="verified_at" type="TIMESTAMP"/>
            <column name="created_at" type="TIMESTAMP" defaultValueComputed="NOW()"/>
        </createTable>
        <createIndex tableName="m_dispro_pacra_verification" indexName="idx_pacra_employer">
            <column name="employer_id"/>
        </createIndex>
        <createIndex tableName="m_dispro_pacra_verification" indexName="idx_pacra_reg_number">
            <column name="registration_number"/>
        </createIndex>
    </changeSet>

    <!-- Sanctions Screening Log -->
    <changeSet id="dispro-sanctions-screening" author="qsoftwares">
        <preConditions onFail="MARK_RAN">
            <not><tableExists tableName="m_dispro_sanctions_screening"/></not>
        </preConditions>
        <createTable tableName="m_dispro_sanctions_screening">
            <column name="id" type="BIGINT" autoIncrement="true"><constraints primaryKey="true"/></column>
            <column name="screened_name" type="VARCHAR(255)"><constraints nullable="false"/></column>
            <column name="screened_type" type="VARCHAR(20)"/>
            <column name="nationality" type="VARCHAR(50)"/>
            <column name="id_number" type="VARCHAR(50)"/>
            <column name="status" type="VARCHAR(20)"><constraints nullable="false"/></column>
            <column name="match_count" type="INT" defaultValueNumeric="0"/>
            <column name="highest_score" type="DECIMAL(5,4)"/>
            <column name="matches_json" type="TEXT"/>
            <column name="employer_id" type="BIGINT"/>
            <column name="screened_at" type="TIMESTAMP" defaultValueComputed="NOW()"/>
        </createTable>
        <createIndex tableName="m_dispro_sanctions_screening" indexName="idx_sanctions_employer">
            <column name="employer_id"/>
        </createIndex>
    </changeSet>
</databaseChangeLog>
'''

files[os.path.join(PROVIDER_CHANGELOG, "0233_dispro_wallet_topup.xml")] = r'''<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                   http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.1.xsd">

    <!-- Wallet Top-Up Transactions -->
    <changeSet id="dispro-wallet-topup" author="qsoftwares">
        <preConditions onFail="MARK_RAN">
            <not><tableExists tableName="m_dispro_wallet_topup"/></not>
        </preConditions>
        <createTable tableName="m_dispro_wallet_topup">
            <column name="id" type="BIGINT" autoIncrement="true"><constraints primaryKey="true"/></column>
            <column name="employer_id" type="BIGINT"><constraints nullable="false"/></column>
            <column name="transaction_id" type="VARCHAR(50)"><constraints unique="true" nullable="false"/></column>
            <column name="channel" type="VARCHAR(20)"><constraints nullable="false"/></column>
            <column name="amount" type="DECIMAL(19,4)"><constraints nullable="false"/></column>
            <column name="fee" type="DECIMAL(19,4)" defaultValueNumeric="0"/>
            <column name="net_amount" type="DECIMAL(19,4)"/>
            <column name="currency" type="VARCHAR(3)" defaultValue="ZMW"/>
            <column name="status" type="VARCHAR(20)"><constraints nullable="false"/></column>
            <column name="reference" type="VARCHAR(100)"/>
            <column name="source_bank_code" type="VARCHAR(10)"/>
            <column name="source_account" type="VARCHAR(30)"/>
            <column name="card_last4" type="VARCHAR(4)"/>
            <column name="virtual_account_number" type="VARCHAR(30)"/>
            <column name="nfs_reference" type="VARCHAR(50)"/>
            <column name="settled_at" type="TIMESTAMP"/>
            <column name="created_at" type="TIMESTAMP" defaultValueComputed="NOW()"/>
        </createTable>
        <createIndex tableName="m_dispro_wallet_topup" indexName="idx_topup_employer">
            <column name="employer_id"/>
        </createIndex>
        <createIndex tableName="m_dispro_wallet_topup" indexName="idx_topup_status">
            <column name="status"/>
        </createIndex>
        <createIndex tableName="m_dispro_wallet_topup" indexName="idx_topup_txn_id">
            <column name="transaction_id"/>
        </createIndex>
    </changeSet>

    <!-- Virtual Account Assignments -->
    <changeSet id="dispro-virtual-accounts" author="qsoftwares">
        <preConditions onFail="MARK_RAN">
            <not><tableExists tableName="m_dispro_virtual_account"/></not>
        </preConditions>
        <createTable tableName="m_dispro_virtual_account">
            <column name="id" type="BIGINT" autoIncrement="true"><constraints primaryKey="true"/></column>
            <column name="employer_id" type="BIGINT"><constraints nullable="false" unique="true"/></column>
            <column name="virtual_account_number" type="VARCHAR(30)"><constraints nullable="false" unique="true"/></column>
            <column name="bank_name" type="VARCHAR(100)" defaultValue="Zanaco PLC"/>
            <column name="bank_branch" type="VARCHAR(100)" defaultValue="Cairo Road, Lusaka"/>
            <column name="active" type="BOOLEAN" defaultValueBoolean="true"/>
            <column name="created_at" type="TIMESTAMP" defaultValueComputed="NOW()"/>
        </createTable>
    </changeSet>
</databaseChangeLog>
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 4. Frontend Services + Hooks
# ═══════════════════════════════════════════════════════════════════════════════

files[os.path.join(SRC, "services", "kyb-live-service.ts")] = '''import api from "./api-client";

const kybLiveService = {
  verifyCompany: (registrationNumber: string) =>
    api.post("/v1/dispro/kyb/live/verify-company", { registrationNumber }),

  checkAnnualReturn: (registrationNumber: string) =>
    api.get(`/v1/dispro/kyb/live/annual-return/${registrationNumber}`),

  triggerAnnualRefresh: (registrationNumber: string) =>
    api.post("/v1/dispro/kyb/live/annual-refresh", { registrationNumber }),

  screenIndividual: (name: string, nationality?: string, idNumber?: string) =>
    api.post("/v1/dispro/kyb/live/screen", { name, nationality, idNumber }),

  screenDirectors: (directors: { name: string; nationality?: string; idNumber?: string }[]) =>
    api.post("/v1/dispro/kyb/live/screen-directors", directors),

  getSanctionsStats: () =>
    api.get("/v1/dispro/kyb/live/sanctions-stats"),
};

export default kybLiveService;
'''

files[os.path.join(SRC, "services", "wallet-topup-service.ts")] = '''import api from "./api-client";

const walletTopUpService = {
  getBalance: (employerId: number) =>
    api.get(`/v1/dispro/wallet/balance/${employerId}`),

  topUpViaVirtualAccount: (employerId: number, amount: number, reference?: string) =>
    api.post("/v1/dispro/wallet/topup/virtual-account", { employerId, amount, reference }),

  topUpViaCard: (employerId: number, amount: number, cardToken: string) =>
    api.post("/v1/dispro/wallet/topup/card", { employerId, amount, cardToken }),

  topUpViaNfs: (employerId: number, amount: number, sourceBankCode: string, sourceAccountNumber: string) =>
    api.post("/v1/dispro/wallet/topup/nfs", { employerId, amount, sourceBankCode, sourceAccountNumber }),

  getTopUpHistory: (employerId: number) =>
    api.get(`/v1/dispro/wallet/topup/history/${employerId}`),
};

export default walletTopUpService;
'''

files[os.path.join(SRC, "hooks", "use-kyb-live.ts")] = '''import { useApiQuery, useApiMutation } from "./use-api";
import kybLiveService from "../services/kyb-live-service";

// ── Mock fallback data ──────────────────────────────────────────────────────

const MOCK_COMPANY_VERIFICATION = {
  registrationNumber: "120150012345",
  status: "ACTIVE",
  verified: true,
  companyName: "Copperbelt Transport Services Ltd",
  companyType: "PRIVATE_LIMITED",
  incorporationDate: "2018-03-15",
  registeredOffice: "Plot 2345, Cairo Road, Lusaka",
  annualReturnDue: "2026-06-30",
  annualReturnFiled: false,
  directors: [
    { name: "Bwalya Mulenga", role: "DIRECTOR", nationality: "ZAMBIAN", idNumber: "123456/78/1" },
    { name: "Chanda Kapasa", role: "SECRETARY", nationality: "ZAMBIAN", idNumber: "234567/89/1" },
  ],
  shareholders: [
    { name: "Bwalya Mulenga", shares: 60, class: "ORDINARY" },
    { name: "Chanda Kapasa", shares: 40, class: "ORDINARY" },
  ],
};

const MOCK_SANCTIONS_STATS = {
  OFAC_SDN: { entries: 2 },
  UN_1267: { entries: 1 },
  BOZ_RESTRICTED: { entries: 1 },
  PEP_ZAMBIA: { entries: 2 },
  lastRefresh: new Date().toISOString(),
  matchThreshold: 0.85,
};

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useCompanyVerification(registrationNumber: string) {
  return useApiQuery(
    () => kybLiveService.verifyCompany(registrationNumber),
    [registrationNumber],
    MOCK_COMPANY_VERIFICATION
  );
}

export function useAnnualReturn(registrationNumber: string) {
  return useApiQuery(
    () => kybLiveService.checkAnnualReturn(registrationNumber),
    [registrationNumber],
    { registrationNumber, currentYear: 2026, filingDeadline: "2026-06-30", filed: false, lastFiledYear: 2025, penalty: false, penaltyAmount: 0 }
  );
}

export function useSanctionsStats() {
  return useApiQuery(
    () => kybLiveService.getSanctionsStats(),
    [],
    MOCK_SANCTIONS_STATS
  );
}

export function useVerifyCompany() {
  return useApiMutation((vars: unknown) => {
    const { registrationNumber } = vars as { registrationNumber: string };
    return kybLiveService.verifyCompany(registrationNumber);
  });
}

export function useScreenIndividual() {
  return useApiMutation((vars: unknown) => {
    const { name, nationality, idNumber } = vars as { name: string; nationality?: string; idNumber?: string };
    return kybLiveService.screenIndividual(name, nationality, idNumber);
  });
}

export function useTriggerAnnualRefresh() {
  return useApiMutation((vars: unknown) => {
    const { registrationNumber } = vars as { registrationNumber: string };
    return kybLiveService.triggerAnnualRefresh(registrationNumber);
  });
}
'''

files[os.path.join(SRC, "hooks", "use-wallet-topup.ts")] = '''import { useApiQuery, useApiMutation } from "./use-api";
import walletTopUpService from "../services/wallet-topup-service";

// ── Mock fallback data ──────────────────────────────────────────────────────

const MOCK_BALANCE = {
  employerId: 1,
  availableBalance: 125000.0,
  pendingDeposits: 50000.0,
  pendingDisbursements: 32500.0,
  currency: "ZMW",
  lastUpdated: new Date().toISOString(),
};

const MOCK_TOPUP_HISTORY = [
  { id: 1, channel: "CARD", amount: 50000, status: "COMPLETED", date: "2026-04-01" },
  { id: 2, channel: "NFS", amount: 75000, status: "COMPLETED", date: "2026-03-28" },
  { id: 3, channel: "VIRTUAL_ACCOUNT", amount: 100000, status: "COMPLETED", date: "2026-03-15" },
  { id: 4, channel: "MOBILE_MONEY", amount: 25000, status: "COMPLETED", date: "2026-03-10" },
  { id: 5, channel: "CARD", amount: 30000, status: "FAILED", date: "2026-03-05" },
];

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useWalletBalance(employerId: number) {
  return useApiQuery(
    () => walletTopUpService.getBalance(employerId),
    [employerId],
    MOCK_BALANCE
  );
}

export function useTopUpHistory(employerId: number) {
  return useApiQuery(
    () => walletTopUpService.getTopUpHistory(employerId),
    [employerId],
    MOCK_TOPUP_HISTORY
  );
}

export function useTopUpViaVirtualAccount() {
  return useApiMutation((vars: unknown) => {
    const { employerId, amount, reference } = vars as { employerId: number; amount: number; reference?: string };
    return walletTopUpService.topUpViaVirtualAccount(employerId, amount, reference);
  });
}

export function useTopUpViaCard() {
  return useApiMutation((vars: unknown) => {
    const { employerId, amount, cardToken } = vars as { employerId: number; amount: number; cardToken: string };
    return walletTopUpService.topUpViaCard(employerId, amount, cardToken);
  });
}

export function useTopUpViaNfs() {
  return useApiMutation((vars: unknown) => {
    const { employerId, amount, sourceBankCode, sourceAccountNumber } = vars as {
      employerId: number; amount: number; sourceBankCode: string; sourceAccountNumber: string;
    };
    return walletTopUpService.topUpViaNfs(employerId, amount, sourceBankCode, sourceAccountNumber);
  });
}
'''

# ═══════════════════════════════════════════════════════════════════════════════
# Write all files
# ═══════════════════════════════════════════════════════════════════════════════

count = 0
for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.lstrip("\n"))
    count += 1

print(f"DisbursePro Sprint 4: {count} files written")
