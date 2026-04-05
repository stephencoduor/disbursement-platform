/**
 * DisbursePro — MTN MoMo Zambia Service
 * Stub integration with MTN Mobile Money Zambia Disbursement API.
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
public class MtnMomoService {

    // MTN MoMo Zambia API configuration (stubs)
    private static final String MTN_API_BASE_URL = "https://sandbox.momodeveloper.mtn.com";
    private static final String MTN_TARGET_ENVIRONMENT = "zambia";
    private static final String MTN_CURRENCY = "ZMW";

    /**
     * Authenticate with MTN MoMo API using API key and secret.
     *
     * @return auth token response
     */
    public Map<String, Object> authenticate() {
        log.info("Authenticating with MTN MoMo Zambia API");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("accessToken", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.stub-mtn-zm-token");
        result.put("tokenType", "access_token");
        result.put("expiresIn", 3600);
        result.put("targetEnvironment", MTN_TARGET_ENVIRONMENT);
        result.put("issuedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return result;
    }

    /**
     * Disburse funds via MTN MoMo Disbursement API.
     *
     * @param request contains phoneNumber, amount, reference
     * @return disbursement result with MTN reference UUID
     */
    public Map<String, Object> disburse(Map<String, Object> request) {
        String txnId = "MTN-ZM-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        String referenceId = UUID.randomUUID().toString();
        String phone = request.getOrDefault("phoneNumber", "+260955678901").toString();
        BigDecimal amount = new BigDecimal(request.getOrDefault("amount", "0").toString());

        log.info("MTN MoMo disbursement: phone={}, amount=ZMW {}", phone, amount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "MTN");
        result.put("transactionId", txnId);
        result.put("referenceId", referenceId);
        result.put("status", "SUCCESSFUL");
        result.put("phoneNumber", phone);
        result.put("amount", amount);
        result.put("currency", MTN_CURRENCY);
        result.put("recipientName", "Chanda Mulenga");
        result.put("reference", request.getOrDefault("reference", "DSB-MTN-001"));
        result.put("financialTransactionId", "FT" + System.currentTimeMillis());
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        result.put("message", "Disbursement completed successfully via MTN MoMo Zambia");

        return result;
    }

    /**
     * Handle MTN MoMo callback (async delivery notification).
     *
     * @param payload callback data from MTN
     * @return acknowledgement
     */
    public Map<String, Object> handleCallback(Map<String, Object> payload) {
        log.info("Processing MTN MoMo callback: {}", payload);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "MTN");
        result.put("acknowledged", true);
        result.put("referenceId", payload.getOrDefault("referenceId", "unknown"));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return result;
    }

    /**
     * Get MTN MoMo wallet balance.
     *
     * @return balance in ZMW
     */
    public Map<String, Object> getBalance() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "MTN");
        result.put("balance", "175000.00");
        result.put("currency", MTN_CURRENCY);
        result.put("accountHolder", "DisbursePro Operations Ltd");
        result.put("accountHolderIdType", "BUSINESS");
        result.put("lastUpdated", "2026-04-05T10:28:00");

        return result;
    }

    /**
     * Get transaction status from MTN MoMo.
     *
     * @param transactionId the MTN transaction reference
     * @return transaction status details
     */
    public Map<String, Object> getTransactionStatus(String transactionId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carrier", "MTN");
        result.put("transactionId", transactionId);
        result.put("status", "SUCCESSFUL");
        result.put("amount", "4500.00");
        result.put("currency", MTN_CURRENCY);
        result.put("recipientPhone", "+260955678901");
        result.put("recipientName", "Chanda Mulenga");
        result.put("reason", "Travel allowance — Copperbelt Province");
        result.put("completedAt", "2026-04-03T09:16:05");

        return result;
    }
}
