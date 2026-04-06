/**
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
