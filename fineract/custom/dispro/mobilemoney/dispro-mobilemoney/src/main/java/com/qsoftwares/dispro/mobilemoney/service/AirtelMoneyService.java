/**
 * DisbursePro — Airtel Money Zambia Service
 * Stub integration with Airtel Money Zambia B2C Disbursement API.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.mobilemoney.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class AirtelMoneyService {

    // Airtel Money Zambia API configuration (stubs)
    private static final String AIRTEL_API_BASE_URL = "https://openapi.airtel.africa";
    private static final String AIRTEL_COUNTRY_CODE = "ZM";
    private static final String AIRTEL_CURRENCY = "ZMW";

    /**
     * Authenticate with Airtel Money API and obtain an access token.
     *
     * @return auth token response with token, expiry
     */
    public Map<String, Object> authenticate() {
        log.info("Authenticating with Airtel Money Zambia API");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("accessToken", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.stub-airtel-zm-token");
        result.put("tokenType", "bearer");
        result.put("expiresIn", 3600);
        result.put("issuedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return result;
    }

    /**
     * Disburse funds via Airtel Money B2C API.
     *
     * @param request contains phoneNumber, amount, reference
     * @return disbursement result with Airtel transaction reference
     */
    public Map<String, Object> disburseB2C(Map<String, Object> request) {
        String txnId = "AIRTEL-ZM-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        String phone = request.getOrDefault("phoneNumber", "+260971234567").toString();
        BigDecimal amount = new BigDecimal(request.getOrDefault("amount", "0").toString());

        log.info("Airtel Money B2C disbursement: phone={}, amount=ZMW {}", phone, amount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "AIRTEL");
        result.put("transactionId", txnId);
        result.put("status", "SUCCESS");
        result.put("phoneNumber", phone);
        result.put("amount", amount);
        result.put("currency", AIRTEL_CURRENCY);
        result.put("recipientName", "Mwila Banda");
        result.put("reference", request.getOrDefault("reference", "DSB-AIRTEL-001"));
        result.put("airtelReference", "AZM" + System.currentTimeMillis());
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        result.put("message", "B2C disbursement completed successfully via Airtel Money Zambia");

        return result;
    }

    /**
     * Handle Airtel Money callback (async status notification).
     *
     * @param payload callback data from Airtel
     * @return acknowledgement
     */
    public Map<String, Object> handleCallback(Map<String, Object> payload) {
        log.info("Processing Airtel Money callback: {}", payload);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "AIRTEL");
        result.put("acknowledged", true);
        result.put("callbackType", payload.getOrDefault("transaction", Map.of()).toString());
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return result;
    }

    /**
     * Get Airtel Money wallet balance.
     *
     * @return balance in ZMW
     */
    public Map<String, Object> getBalance() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "AIRTEL");
        result.put("balance", "185000.00");
        result.put("currency", AIRTEL_CURRENCY);
        result.put("accountName", "DisbursePro Operations Ltd");
        result.put("accountNumber", "AIRTEL-ZM-CORP-001");
        result.put("lastUpdated", "2026-04-05T10:30:00");

        return result;
    }

    /**
     * Get transaction status from Airtel Money.
     *
     * @param transactionId the Airtel transaction reference
     * @return transaction status details
     */
    public Map<String, Object> getTransactionStatus(String transactionId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "AIRTEL");
        result.put("transactionId", transactionId);
        result.put("status", "COMPLETED");
        result.put("amount", "8500.00");
        result.put("currency", AIRTEL_CURRENCY);
        result.put("recipientPhone", "+260971234567");
        result.put("recipientName", "Mwila Banda");
        result.put("completedAt", "2026-04-03T09:16:05");

        return result;
    }
}
