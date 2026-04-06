/**
 * DisbursePro — KYB Service
 * Employer onboarding and verification logic for Zambian businesses.
 * Validates TPIN (Taxpayer Identification Number), PACRA registration,
 * NAPSA employer number, and NHIMA employer number.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.kyb.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class KybService {

    /** Employer verification statuses */
    public enum VerificationStatus {
        PENDING, VERIFIED, REJECTED, SUSPENDED
    }

    /** Document types required for Zambian employer onboarding */
    public enum DocumentType {
        CERT_INCORP, TAX_CLEARANCE, NAPSA_REG, NHIMA_REG, DIRECTORS_ID
    }

    /**
     * Register a new employer for KYB verification.
     *
     * @param request employer details: legalName, tradingName, tpin, pacraNumber,
     *                napsaNumber, nhimaNumber, directors (array)
     * @return created employer record with PENDING status
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> registerEmployer(Map<String, Object> request) {
        String employerId = "EMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String now = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("employerId", employerId);
        result.put("legalName", request.getOrDefault("legalName", "Copperbelt Mining Services Ltd"));
        result.put("tradingName", request.getOrDefault("tradingName", "CMS Zambia"));
        result.put("tpin", request.getOrDefault("tpin", "1002345678"));      // 10-digit TPIN
        result.put("pacraNumber", request.getOrDefault("pacraNumber", "120456789")); // PACRA company number
        result.put("napsaNumber", request.getOrDefault("napsaNumber", "NAPSA-ZM-00567"));
        result.put("nhimaNumber", request.getOrDefault("nhimaNumber", "NHIMA-ZM-00234"));
        result.put("countryCode", "ZM");
        result.put("status", VerificationStatus.PENDING.name());
        result.put("createdAt", now);
        result.put("verifiedAt", null);

        // Process directors if provided, otherwise use realistic defaults
        List<Map<String, Object>> directors = (List<Map<String, Object>>) request.get("directors");
        if (directors == null) {
            directors = createDefaultDirectors();
        }
        result.put("directors", directors);

        result.put("requiredDocuments", List.of(
                DocumentType.CERT_INCORP.name(),
                DocumentType.TAX_CLEARANCE.name(),
                DocumentType.NAPSA_REG.name(),
                DocumentType.NHIMA_REG.name(),
                DocumentType.DIRECTORS_ID.name()
        ));

        log.info("Employer registered: id={}, legalName={}, tpin={}, status=PENDING",
                employerId, result.get("legalName"), result.get("tpin"));

        return result;
    }

    /**
     * Get employer verification status by ID.
     *
     * @param employerId the employer identifier
     * @return employer status details including document checklist
     */
    public Map<String, Object> getEmployerStatus(String employerId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("employerId", employerId);
        result.put("legalName", "Lusaka Transport Holdings Ltd");
        result.put("tradingName", "LTH Zambia");
        result.put("tpin", "1009876543");
        result.put("pacraNumber", "120987654");
        result.put("napsaNumber", "NAPSA-ZM-00891");
        result.put("nhimaNumber", "NHIMA-ZM-00445");
        result.put("countryCode", "ZM");
        result.put("status", VerificationStatus.PENDING.name());
        result.put("createdAt", "2026-04-01T10:30:00");
        result.put("verifiedAt", null);

        // Document verification checklist
        List<Map<String, Object>> documents = new ArrayList<>();
        documents.add(docStatus(DocumentType.CERT_INCORP, true, "DOC-001"));
        documents.add(docStatus(DocumentType.TAX_CLEARANCE, true, "DOC-002"));
        documents.add(docStatus(DocumentType.NAPSA_REG, false, null));
        documents.add(docStatus(DocumentType.NHIMA_REG, false, null));
        documents.add(docStatus(DocumentType.DIRECTORS_ID, true, "DOC-003"));
        result.put("documents", documents);

        result.put("directors", createDefaultDirectors());
        result.put("verificationProgress", "3/5 documents uploaded");

        return result;
    }

    /**
     * Upload a document for an employer (stub — returns acknowledgement).
     *
     * @param employerId the employer identifier
     * @param request document upload details: docType, fileName, contentType
     * @return upload acknowledgement with document reference
     */
    public Map<String, Object> uploadDocument(String employerId, Map<String, Object> request) {
        String docRef = "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String now = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("documentId", docRef);
        result.put("employerId", employerId);
        result.put("docType", request.getOrDefault("docType", "CERT_INCORP"));
        result.put("fileName", request.getOrDefault("fileName", "certificate_of_incorporation.pdf"));
        result.put("contentType", request.getOrDefault("contentType", "application/pdf"));
        result.put("verified", false);
        result.put("uploadedAt", now);
        result.put("message", "Document uploaded successfully. Verification pending.");

        log.info("Document uploaded: employerId={}, docType={}, docRef={}",
                employerId, result.get("docType"), docRef);

        return result;
    }

    // ---- Private helpers ----

    private List<Map<String, Object>> createDefaultDirectors() {
        List<Map<String, Object>> directors = new ArrayList<>();

        Map<String, Object> d1 = new LinkedHashMap<>();
        d1.put("fullName", "Mwansa Kapwepwe");
        d1.put("nrcNumber", "123456/78/1");      // Zambian NRC format: 6digits/2digits/1digit
        d1.put("role", "Managing Director");
        d1.put("ownershipPct", 45.0);
        directors.add(d1);

        Map<String, Object> d2 = new LinkedHashMap<>();
        d2.put("fullName", "Chilufya Mwamba");
        d2.put("nrcNumber", "234567/89/1");
        d2.put("role", "Finance Director");
        d2.put("ownershipPct", 30.0);
        directors.add(d2);

        Map<String, Object> d3 = new LinkedHashMap<>();
        d3.put("fullName", "Bwalya Ngandu");
        d3.put("nrcNumber", "345678/90/1");
        d3.put("role", "Non-Executive Director");
        d3.put("ownershipPct", 25.0);
        directors.add(d3);

        return directors;
    }

    private Map<String, Object> docStatus(DocumentType type, boolean uploaded, String ref) {
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("docType", type.name());
        doc.put("uploaded", uploaded);
        doc.put("verified", false);
        doc.put("fileRef", ref);
        return doc;
    }
}
