/**
 * DisbursePro — Wallet Service
 * Custodial wallet management with daily and monthly limits for Zambian mobile money disbursements.
 *
 * Daily limit: ZMW 500,000
 * Monthly limit: ZMW 10,000,000
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.wallet.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class WalletService {

    /** Daily disbursement limit in ZMW */
    private static final BigDecimal DAILY_LIMIT = new BigDecimal("500000.00");

    /** Monthly disbursement limit in ZMW */
    private static final BigDecimal MONTHLY_LIMIT = new BigDecimal("10000000.00");

    private static final String CURRENCY = "ZMW";

    /**
     * Get current wallet balance with limit information.
     */
    public Map<String, Object> getBalance() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("walletId", "WLT-DISPRO-ZM-001");
        result.put("companyName", "DisbursePro Operations Ltd");
        result.put("balance", "485000.00");
        result.put("currency", CURRENCY);
        result.put("dailyLimit", DAILY_LIMIT);
        result.put("dailyUsed", "127500.00");
        result.put("dailyRemaining", "372500.00");
        result.put("monthlyLimit", MONTHLY_LIMIT);
        result.put("monthlyUsed", "3245000.00");
        result.put("monthlyRemaining", "6755000.00");
        result.put("status", "ACTIVE");
        result.put("lastTopUp", "2026-04-04T09:00:00");
        result.put("lastDisbursement", "2026-04-05T10:15:00");
        result.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return result;
    }

    /**
     * Top up the company wallet.
     *
     * @param request contains amount, source, reference
     * @return top-up confirmation
     */
    public Map<String, Object> topUp(Map<String, Object> request) {
        String topUpId = "TOP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal amount = new BigDecimal(request.getOrDefault("amount", "0").toString());
        String source = request.getOrDefault("source", "BANK_TRANSFER").toString();

        BigDecimal currentBalance = new BigDecimal("485000.00");
        BigDecimal newBalance = currentBalance.add(amount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("topUpId", topUpId);
        result.put("amount", amount);
        result.put("currency", CURRENCY);
        result.put("source", source);
        result.put("reference", request.getOrDefault("reference", "TOPUP-" + System.currentTimeMillis()));
        result.put("previousBalance", currentBalance);
        result.put("newBalance", newBalance);
        result.put("status", "COMPLETED");
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        result.put("message", "Wallet topped up successfully");

        log.info("Wallet topped up: amount=ZMW {}, source={}, newBalance=ZMW {}", amount, source, newBalance);

        return result;
    }

    /**
     * Get wallet transaction history with realistic Zambian mock data.
     */
    public Map<String, Object> getTransactionHistory() {
        List<Map<String, Object>> transactions = new ArrayList<>();

        transactions.add(walletTxn("WTX-001", "TOP_UP", new BigDecimal("200000.00"), "CREDIT",
                "Bank transfer top-up — Zanaco Corporate Account", "2026-04-04T09:00:00"));
        transactions.add(walletTxn("WTX-002", "DISBURSEMENT", new BigDecimal("8500.00"), "DEBIT",
                "Salary — Mwila Banda via Airtel Money", "2026-04-03T09:15:00"));
        transactions.add(walletTxn("WTX-003", "DISBURSEMENT", new BigDecimal("4500.00"), "DEBIT",
                "Travel allowance — Chanda Mulenga via MTN MoMo", "2026-04-03T09:16:00"));
        transactions.add(walletTxn("WTX-004", "DISBURSEMENT", new BigDecimal("2000.00"), "DEBIT",
                "Fuel — Bwalya Musonda via Zamtel Kwacha", "2026-04-03T10:30:00"));
        transactions.add(walletTxn("WTX-005", "FEE", new BigDecimal("150.00"), "DEBIT",
                "Platform fee — Batch April salary disbursement", "2026-04-03T09:17:00"));
        transactions.add(walletTxn("WTX-006", "DISBURSEMENT", new BigDecimal("75000.00"), "DEBIT",
                "Operational funds — Kabwe Tembo via Airtel Money", "2026-04-02T14:00:00"));
        transactions.add(walletTxn("WTX-007", "TOP_UP", new BigDecimal("500000.00"), "CREDIT",
                "Bank transfer top-up — Stanbic Business Account", "2026-04-01T08:30:00"));
        transactions.add(walletTxn("WTX-008", "DISBURSEMENT", new BigDecimal("28000.00"), "DEBIT",
                "Vendor payment — Nachilala Mwamba via MTN MoMo", "2026-04-01T11:45:00"));
        transactions.add(walletTxn("WTX-009", "CARRIER_FEE", new BigDecimal("425.00"), "DEBIT",
                "Airtel Money carrier fees — 5 transactions", "2026-04-01T23:59:00"));
        transactions.add(walletTxn("WTX-010", "LEVY", new BigDecimal("2.50"), "DEBIT",
                "Government levy — 5 transactions above ZMW 5,000", "2026-04-01T23:59:00"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalRecords", transactions.size());
        result.put("page", 1);
        result.put("pageSize", 20);
        result.put("transactions", transactions);

        return result;
    }

    /**
     * Check remaining daily disbursement limit.
     */
    public Map<String, Object> getDailyLimit() {
        BigDecimal used = new BigDecimal("127500.00");
        BigDecimal remaining = DAILY_LIMIT.subtract(used);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("date", "2026-04-05");
        result.put("dailyLimit", DAILY_LIMIT);
        result.put("used", used);
        result.put("remaining", remaining);
        result.put("currency", CURRENCY);
        result.put("transactionCount", 15);
        result.put("utilizationPercent", "25.5%");
        result.put("resetsAt", "2026-04-06T00:00:00");

        return result;
    }

    /**
     * Get monthly spend summary broken down by category and carrier.
     */
    public Map<String, Object> getMonthlySummary() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("month", "April 2026");
        result.put("monthlyLimit", MONTHLY_LIMIT);
        result.put("totalSpend", "3245000.00");
        result.put("remaining", "6755000.00");
        result.put("currency", CURRENCY);
        result.put("totalDisbursements", 142);
        result.put("totalTopUps", "4500000.00");

        result.put("byCategory", Map.of(
                "SALARY", "1850000.00",
                "TRAVEL_ALLOWANCE", "425000.00",
                "FUEL", "180000.00",
                "PER_DIEM", "290000.00",
                "FIELD_EXPENSES", "115000.00",
                "OPERATIONAL", "225000.00",
                "VENDOR", "95000.00",
                "MEDICAL", "35000.00",
                "TRAINING", "30000.00"
        ));

        result.put("byCarrier", Map.of(
                "AIRTEL", Map.of("count", 62, "amount", "1520000.00"),
                "MTN", Map.of("count", 51, "amount", "1125000.00"),
                "ZAMTEL", Map.of("count", 29, "amount", "600000.00")
        ));

        result.put("fees", Map.of(
                "platformFees", "32450.00",
                "carrierFees", "68145.00",
                "levies", "42.50",
                "totalFees", "100637.50"
        ));

        return result;
    }

    // ---- Private helpers ----

    private Map<String, Object> walletTxn(String txnId, String type, BigDecimal amount, String direction,
            String description, String timestamp) {
        Map<String, Object> txn = new LinkedHashMap<>();
        txn.put("transactionId", txnId);
        txn.put("type", type);
        txn.put("amount", amount);
        txn.put("direction", direction);
        txn.put("currency", CURRENCY);
        txn.put("description", description);
        txn.put("timestamp", timestamp);
        return txn;
    }
}
