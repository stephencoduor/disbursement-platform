/**
 * DisbursePro — KYB Service
 * Handles employer onboarding, document verification, and director KYC for Zambia.
 * Stub implementation — production will integrate with PACRA, ZRA, NAPSA, NHIMA.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.kyb.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class KybService {

    public Map<String, Object> registerEmployer(Map<String, Object> request) {
        String employerId = "EMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("employerId", employerId);
        result.put("legalName", request.getOrDefault("legalName", "Mopani Copper Mines PLC"));
        result.put("tradingName", request.getOrDefault("tradingName", "Mopani Copper"));
        result.put("tpin", request.getOrDefault("tpin", "1004567890"));
        result.put("pacraNumber", request.getOrDefault("pacraNumber", "120045678"));
        result.put("napsaNumber", request.getOrDefault("napsaNumber", "NAPSA-ZM-2025-001"));
        result.put("nhimaNumber", request.getOrDefault("nhimaNumber", "NHIMA-ZM-2025-001"));
        result.put("countryCode", "ZM");
        result.put("status", "PENDING");
        result.put("createdAt", Instant.now().toString());
        result.put("verifiedAt", null);
        result.put("requiredDocuments", List.of(
                "CERT_INCORP", "TAX_CLEARANCE", "NAPSA_REG", "NHIMA_REG", "DIRECTORS_ID"
        ));
        result.put("message", "Employer registered. Please upload required documents for verification.");

        log.info("Employer registered: id={}, tpin={}", employerId, result.get("tpin"));
        return result;
    }

    public Map<String, Object> getEmployerStatus(String employerId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("employerId", employerId);
        result.put("status", "PENDING");
        result.put("verificationChecks", Map.of(
                "tpinVerified", false,
                "pacraVerified", false,
                "napsaRegistered", false,
                "nhimaRegistered", false,
                "documentsComplete", false,
                "directorsVerified", false
        ));
        result.put("documentsUploaded", 0);
        result.put("documentsRequired", 5);
        result.put("directorsRegistered", 0);
        result.put("message", "Awaiting document uploads and verification.");
        return result;
    }

    public Map<String, Object> uploadDocument(String employerId, Map<String, Object> request) {
        String docId = "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String docType = (String) request.getOrDefault("docType", "CERT_INCORP");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("documentId", docId);
        result.put("employerId", employerId);
        result.put("docType", docType);
        result.put("fileRef", request.getOrDefault("fileRef", "s3://dispro-kyb/" + employerId + "/" + docType + ".pdf"));
        result.put("verified", false);
        result.put("uploadedAt", Instant.now().toString());
        result.put("message", "Document uploaded. Verification pending.");

        log.info("Document uploaded: docId={}, employerId={}, type={}", docId, employerId, docType);
        return result;
    }
}
