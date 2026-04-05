/**
 * DisbursePro — Approval Workflow Service
 * Configurable multi-tier approval logic for Zambian mobile money disbursements.
 *
 * Thresholds:
 *   - Less than ZMW 5,000: Auto-approve
 *   - ZMW 5,000 to ZMW 50,000: Single approver required
 *   - Greater than ZMW 50,000: Dual approval required
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.approval.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ApprovalWorkflowService {

    /** Auto-approve threshold: amounts below this are automatically approved */
    private static final BigDecimal AUTO_APPROVE_THRESHOLD = new BigDecimal("5000.00");

    /** Single approval threshold: amounts between auto-approve and this need one approver */
    private static final BigDecimal SINGLE_APPROVAL_THRESHOLD = new BigDecimal("50000.00");

    /**
     * Determine the approval tier for a given amount.
     *
     * @param amount disbursement amount in ZMW
     * @return approval tier: AUTO, SINGLE, or DUAL
     */
    public String determineApprovalTier(BigDecimal amount) {
        if (amount.compareTo(AUTO_APPROVE_THRESHOLD) < 0) {
            return "AUTO";
        } else if (amount.compareTo(SINGLE_APPROVAL_THRESHOLD) <= 0) {
            return "SINGLE";
        } else {
            return "DUAL";
        }
    }

    /**
     * List all pending approvals with Zambian mock data.
     */
    public Map<String, Object> listPendingApprovals() {
        List<Map<String, Object>> pending = new ArrayList<>();

        pending.add(mockApproval("APR-001", "DSB-M3N4O5P6", "Mutale Chilufya", "+260977890123",
                new BigDecimal("12000.00"), "AIRTEL", "PER_DIEM", "SINGLE",
                "Field visit per diem — Livingstone district", "PENDING_APPROVAL"));
        pending.add(mockApproval("APR-002", "DSB-U1V2W3X4", "Kabwe Tembo", "+260950112233",
                new BigDecimal("75000.00"), "AIRTEL", "OPERATIONAL", "DUAL",
                "Quarterly operational funds — Southern Province office", "PENDING_FIRST_APPROVAL"));
        pending.add(mockApproval("APR-003", "DSB-K8L9M0N1", "Nachilala Mwamba", "+260972998877",
                new BigDecimal("28000.00"), "MTN", "VENDOR", "SINGLE",
                "Supplier payment — Lusaka office supplies", "PENDING_APPROVAL"));
        pending.add(mockApproval("APR-004", "DSB-P2Q3R4S5", "Chilombo Sakala", "+260966554433",
                new BigDecimal("95000.00"), "MTN", "SALARY", "DUAL",
                "Batch salary top-up — Copperbelt team", "PENDING_SECOND_APPROVAL"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalPending", pending.size());
        result.put("approvals", pending);

        return result;
    }

    /**
     * Approve a disbursement.
     */
    public Map<String, Object> approve(String id, Map<String, Object> request) {
        String approverName = request.getOrDefault("approverName", "Mulenga Kapwepwe").toString();
        String approverRole = request.getOrDefault("approverRole", "Finance Manager").toString();
        String comments = request.getOrDefault("comments", "Approved — within budget allocation").toString();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("approvalId", id);
        result.put("action", "APPROVED");
        result.put("approverName", approverName);
        result.put("approverRole", approverRole);
        result.put("comments", comments);
        result.put("approvedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        result.put("message", "Disbursement approved successfully. Queued for processing.");

        log.info("Disbursement approved: id={}, approver={}", id, approverName);

        return result;
    }

    /**
     * Reject a disbursement with reason.
     */
    public Map<String, Object> reject(String id, Map<String, Object> request) {
        String rejectorName = request.getOrDefault("rejectorName", "Mulenga Kapwepwe").toString();
        String rejectorRole = request.getOrDefault("rejectorRole", "Finance Manager").toString();
        String reason = request.getOrDefault("reason", "Insufficient supporting documents").toString();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("approvalId", id);
        result.put("action", "REJECTED");
        result.put("rejectorName", rejectorName);
        result.put("rejectorRole", rejectorRole);
        result.put("reason", reason);
        result.put("rejectedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        result.put("message", "Disbursement rejected. Initiator will be notified.");

        log.info("Disbursement rejected: id={}, reason={}", id, reason);

        return result;
    }

    /**
     * Get approval history with realistic Zambian data.
     */
    public Map<String, Object> getApprovalHistory() {
        List<Map<String, Object>> history = new ArrayList<>();

        history.add(historyEntry("APR-H001", "DSB-A1B2C3D4", "Mwila Banda", new BigDecimal("8500.00"),
                "SALARY", "APPROVED", "Mulenga Kapwepwe", "2026-04-03T08:30:00"));
        history.add(historyEntry("APR-H002", "DSB-E5F6G7H8", "Chanda Mulenga", new BigDecimal("4500.00"),
                "TRAVEL_ALLOWANCE", "AUTO_APPROVED", "System", "2026-04-03T09:00:00"));
        history.add(historyEntry("APR-H003", "DSB-X1Y2Z3A4", "Temwani Lungu", new BigDecimal("62000.00"),
                "OPERATIONAL", "APPROVED", "Mulenga Kapwepwe, Josephine Ngoma", "2026-04-02T14:15:00"));
        history.add(historyEntry("APR-H004", "DSB-B5C6D7E8", "Kasonde Mutale", new BigDecimal("15000.00"),
                "TRAINING", "REJECTED", "Mulenga Kapwepwe", "2026-04-02T11:00:00"));
        history.add(historyEntry("APR-H005", "DSB-F9G0H1I2", "Nchimunya Phiri", new BigDecimal("1500.00"),
                "MEDICAL", "AUTO_APPROVED", "System", "2026-04-01T16:45:00"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalRecords", history.size());
        result.put("history", history);

        return result;
    }

    /**
     * Get approval statistics.
     */
    public Map<String, Object> getApprovalStats() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("pending", 4);
        result.put("pendingSingleApproval", 2);
        result.put("pendingDualApproval", 2);
        result.put("approvedToday", 12);
        result.put("rejectedToday", 1);
        result.put("autoApprovedToday", 8);
        result.put("approvedThisWeek", 47);
        result.put("rejectedThisWeek", 3);
        result.put("autoApprovedThisWeek", 31);
        result.put("averageApprovalTimeMinutes", 14);
        result.put("currency", "ZMW");
        result.put("totalPendingAmount", "210000.00");
        result.put("totalApprovedTodayAmount", "385000.00");
        result.put("thresholds", Map.of(
                "autoApprove", "< ZMW 5,000",
                "singleApproval", "ZMW 5,000 - ZMW 50,000",
                "dualApproval", "> ZMW 50,000"
        ));

        return result;
    }

    // ---- Private helpers ----

    private Map<String, Object> mockApproval(String approvalId, String disbursementId, String employeeName,
            String phone, BigDecimal amount, String carrier, String purpose, String tier,
            String intent, String status) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("approvalId", approvalId);
        item.put("disbursementId", disbursementId);
        item.put("employeeName", employeeName);
        item.put("phoneNumber", phone);
        item.put("amount", amount);
        item.put("currency", "ZMW");
        item.put("carrier", carrier);
        item.put("purpose", purpose);
        item.put("approvalTier", tier);
        item.put("intent", intent);
        item.put("status", status);
        item.put("submittedAt", "2026-04-05T08:00:00");
        item.put("submittedBy", "ops@disbursepro.zm");
        return item;
    }

    private Map<String, Object> historyEntry(String approvalId, String disbursementId, String employeeName,
            BigDecimal amount, String purpose, String action, String actionBy, String actionAt) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("approvalId", approvalId);
        item.put("disbursementId", disbursementId);
        item.put("employeeName", employeeName);
        item.put("amount", amount);
        item.put("currency", "ZMW");
        item.put("purpose", purpose);
        item.put("action", action);
        item.put("actionBy", actionBy);
        item.put("actionAt", actionAt);
        return item;
    }
}
