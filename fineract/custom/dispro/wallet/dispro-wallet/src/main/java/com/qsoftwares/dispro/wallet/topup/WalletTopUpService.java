/**
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
