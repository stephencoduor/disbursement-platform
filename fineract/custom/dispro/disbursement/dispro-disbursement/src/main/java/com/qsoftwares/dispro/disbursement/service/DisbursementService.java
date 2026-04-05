/**
 * DisbursePro — Disbursement Service
 * Core disbursement logic for single and bulk mobile money disbursements in Zambia.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.disbursement.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisbursementService {

    private final FeeCalculationService feeCalculationService;

    /** Supported Zambian mobile money carriers */
    public enum Carrier {
        AIRTEL, MTN, ZAMTEL
    }

    /** Disbursement purpose categories */
    public enum Purpose {
        SALARY, TRAVEL_ALLOWANCE, FUEL, PER_DIEM, FIELD_EXPENSES,
        OPERATIONAL, VENDOR, MEDICAL, TRAINING, OTHER
    }

    /** Disbursement statuses */
    public enum Status {
        PENDING, APPROVED, PROCESSING, COMPLETED, FAILED, CANCELLED
    }

    /**
     * Create a single disbursement to an employee.
     *
     * @param request contains employeeName, phoneNumber, amount, carrier, purpose, intent
     * @return disbursement record with generated ID and PENDING status
     */
    public Map<String, Object> createSingleDisbursement(Map<String, Object> request) {
        String disbursementId = "DSB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal amount = new BigDecimal(request.getOrDefault("amount", "0").toString());
        String carrier = request.getOrDefault("carrier", "AIRTEL").toString().toUpperCase();

        Map<String, Object> fees = feeCalculationService.calculateFees(amount, carrier);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("disbursementId", disbursementId);
        result.put("status", Status.PENDING.name());
        result.put("employeeName", request.getOrDefault("employeeName", "Mwila Banda"));
        result.put("phoneNumber", request.getOrDefault("phoneNumber", "+260971234567"));
        result.put("amount", amount);
        result.put("currency", "ZMW");
        result.put("carrier", carrier);
        result.put("purpose", request.getOrDefault("purpose", "SALARY"));
        result.put("intent", request.getOrDefault("intent", "Employee salary disbursement"));
        result.put("fees", fees);
        result.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        result.put("createdBy", "admin@disbursepro.zm");

        log.info("Single disbursement created: id={}, employee={}, amount=ZMW {}, carrier={}",
                disbursementId, result.get("employeeName"), amount, carrier);

        return result;
    }

    /**
     * Create a bulk disbursement batch for multiple employees.
     *
     * @param request contains batchName, description, and disbursements array
     * @return batch summary with individual disbursement IDs
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> createBulkDisbursement(Map<String, Object> request) {
        String batchId = "BATCH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Mock bulk disbursement entries if none provided
        List<Map<String, Object>> disbursements = (List<Map<String, Object>>) request.get("disbursements");
        if (disbursements == null) {
            disbursements = createMockBulkDisbursements();
        }

        List<Map<String, Object>> processedItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Map<String, Object> item : disbursements) {
            Map<String, Object> processed = createSingleDisbursement(item);
            processedItems.add(processed);
            totalAmount = totalAmount.add(new BigDecimal(item.getOrDefault("amount", "0").toString()));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("batchId", batchId);
        result.put("batchName", request.getOrDefault("batchName", "April 2026 Salary Run"));
        result.put("description", request.getOrDefault("description", "Monthly salary disbursement for field staff"));
        result.put("status", Status.PENDING.name());
        result.put("totalDisbursements", processedItems.size());
        result.put("totalAmount", totalAmount);
        result.put("currency", "ZMW");
        result.put("disbursements", processedItems);
        result.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        log.info("Bulk disbursement created: batchId={}, count={}, totalAmount=ZMW {}",
                batchId, processedItems.size(), totalAmount);

        return result;
    }

    /**
     * Get disbursement details by ID.
     */
    public Map<String, Object> getDisbursement(String id) {
        // Stub: return realistic mock data
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("disbursementId", id);
        result.put("status", Status.COMPLETED.name());
        result.put("employeeName", "Chanda Mulenga");
        result.put("phoneNumber", "+260955678901");
        result.put("amount", new BigDecimal("4500.00"));
        result.put("currency", "ZMW");
        result.put("carrier", Carrier.MTN.name());
        result.put("purpose", Purpose.TRAVEL_ALLOWANCE.name());
        result.put("intent", "Field visit travel allowance — Copperbelt Province");
        result.put("fees", feeCalculationService.calculateFees(new BigDecimal("4500.00"), "MTN"));
        result.put("carrierReference", "MTN-ZM-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        result.put("createdAt", "2026-04-03T09:15:00");
        result.put("processedAt", "2026-04-03T09:15:42");
        result.put("completedAt", "2026-04-03T09:16:05");
        result.put("createdBy", "admin@disbursepro.zm");
        result.put("approvedBy", "finance@disbursepro.zm");

        return result;
    }

    /**
     * List disbursements with optional filters.
     */
    public Map<String, Object> listDisbursements(String status, String dateFrom, String dateTo, String carrier) {
        List<Map<String, Object>> items = new ArrayList<>();

        items.add(mockDisbursementSummary("DSB-A1B2C3D4", "Mwila Banda", "+260971234567",
                new BigDecimal("8500.00"), "AIRTEL", "SALARY", Status.COMPLETED));
        items.add(mockDisbursementSummary("DSB-E5F6G7H8", "Chanda Mulenga", "+260955678901",
                new BigDecimal("4500.00"), "MTN", "TRAVEL_ALLOWANCE", Status.COMPLETED));
        items.add(mockDisbursementSummary("DSB-I9J0K1L2", "Bwalya Musonda", "+260961345678",
                new BigDecimal("2000.00"), "ZAMTEL", "FUEL", Status.PROCESSING));
        items.add(mockDisbursementSummary("DSB-M3N4O5P6", "Mutale Chilufya", "+260977890123",
                new BigDecimal("12000.00"), "AIRTEL", "PER_DIEM", Status.PENDING));
        items.add(mockDisbursementSummary("DSB-Q7R8S9T0", "Namwinga Zulu", "+260966234567",
                new BigDecimal("3200.00"), "MTN", "FIELD_EXPENSES", Status.APPROVED));
        items.add(mockDisbursementSummary("DSB-U1V2W3X4", "Kabwe Tembo", "+260950112233",
                new BigDecimal("75000.00"), "AIRTEL", "OPERATIONAL", Status.PENDING));
        items.add(mockDisbursementSummary("DSB-Y5Z6A7B8", "Nchimunya Phiri", "+260972345678",
                new BigDecimal("1500.00"), "ZAMTEL", "MEDICAL", Status.COMPLETED));
        items.add(mockDisbursementSummary("DSB-C9D0E1F2", "Lubinda Siame", "+260955001122",
                new BigDecimal("6800.00"), "MTN", "TRAINING", Status.FAILED));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalRecords", items.size());
        result.put("page", 1);
        result.put("pageSize", 20);
        result.put("filters", Map.of(
                "status", status != null ? status : "ALL",
                "carrier", carrier != null ? carrier : "ALL",
                "dateFrom", dateFrom != null ? dateFrom : "",
                "dateTo", dateTo != null ? dateTo : ""
        ));
        result.put("disbursements", items);

        return result;
    }

    /**
     * Cancel a pending disbursement.
     */
    public Map<String, Object> cancelDisbursement(String id) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("disbursementId", id);
        result.put("previousStatus", Status.PENDING.name());
        result.put("status", Status.CANCELLED.name());
        result.put("cancelledAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        result.put("cancelledBy", "admin@disbursepro.zm");
        result.put("message", "Disbursement cancelled successfully");

        log.info("Disbursement cancelled: id={}", id);
        return result;
    }

    // ---- Private helpers ----

    private Map<String, Object> mockDisbursementSummary(String id, String name, String phone,
            BigDecimal amount, String carrier, String purpose, Status status) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("disbursementId", id);
        item.put("employeeName", name);
        item.put("phoneNumber", phone);
        item.put("amount", amount);
        item.put("currency", "ZMW");
        item.put("carrier", carrier);
        item.put("purpose", purpose);
        item.put("status", status.name());
        item.put("createdAt", "2026-04-03T09:00:00");
        return item;
    }

    private List<Map<String, Object>> createMockBulkDisbursements() {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(Map.of("employeeName", "Mwila Banda", "phoneNumber", "+260971234567",
                "amount", "8500.00", "carrier", "AIRTEL", "purpose", "SALARY",
                "intent", "April 2026 salary"));
        list.add(Map.of("employeeName", "Chanda Mulenga", "phoneNumber", "+260955678901",
                "amount", "7800.00", "carrier", "MTN", "purpose", "SALARY",
                "intent", "April 2026 salary"));
        list.add(Map.of("employeeName", "Bwalya Musonda", "phoneNumber", "+260961345678",
                "amount", "9200.00", "carrier", "ZAMTEL", "purpose", "SALARY",
                "intent", "April 2026 salary"));
        list.add(Map.of("employeeName", "Mutale Chilufya", "phoneNumber", "+260977890123",
                "amount", "6500.00", "carrier", "AIRTEL", "purpose", "SALARY",
                "intent", "April 2026 salary"));
        list.add(Map.of("employeeName", "Namwinga Zulu", "phoneNumber", "+260966234567",
                "amount", "7100.00", "carrier", "MTN", "purpose", "SALARY",
                "intent", "April 2026 salary"));
        return list;
    }
}
