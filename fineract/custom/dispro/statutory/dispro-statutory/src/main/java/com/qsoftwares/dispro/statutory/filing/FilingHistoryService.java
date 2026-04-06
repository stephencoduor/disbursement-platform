/**
 * DisbursePro — Filing History Service
 * Tracks all statutory filing submissions — PAYE, NAPSA, NHIMA, SDL.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.filing;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class FilingHistoryService {

    private final ConcurrentHashMap<String, Map<String, Object>> filings = new ConcurrentHashMap<>();

    // Initialize with some realistic mock history
    {
        recordFiling("FILING-001", "PAYE", "2026-03", "1001234567", "SUBMITTED", 50, 245_000_00L);
        recordFiling("FILING-002", "NAPSA", "2026-03", "NAPSA-EMP-001", "SUBMITTED", 50, 85_410_00L);
        recordFiling("FILING-003", "NHIMA", "2026-03", "NHIMA-001", "SUBMITTED", 50, 24_600_00L);
        recordFiling("FILING-004", "PAYE", "2026-02", "1001234567", "ACCEPTED", 48, 238_500_00L);
        recordFiling("FILING-005", "NAPSA", "2026-02", "NAPSA-EMP-001", "ACCEPTED", 48, 83_200_00L);
    }

    public void recordFiling(String filingId, String filingType, String period,
                             String registrationNumber, String status,
                             int recordCount, long totalAmountNgwee) {
        Map<String, Object> filing = new LinkedHashMap<>();
        filing.put("filingId", filingId);
        filing.put("filingType", filingType);
        filing.put("period", period);
        filing.put("registrationNumber", registrationNumber);
        filing.put("status", status);
        filing.put("recordCount", recordCount);
        filing.put("totalAmountNgwee", totalAmountNgwee);
        filing.put("totalAmountZmw", String.format("%.2f", totalAmountNgwee / 100.0));
        filing.put("submittedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        filings.put(filingId, filing);
    }

    public List<Map<String, Object>> getFilingHistory(String employerTpin) {
        return filings.values().stream()
            .sorted((a, b) -> ((String) b.get("submittedAt")).compareTo((String) a.get("submittedAt")))
            .toList();
    }

    public Map<String, Object> getFiling(String filingId) {
        return filings.getOrDefault(filingId, Map.of("error", "Filing not found"));
    }
}
