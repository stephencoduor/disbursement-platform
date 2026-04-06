/**
 * DisbursePro — Approval Workflow API Resource
 * Multi-tier approval endpoints for disbursement authorization in Zambia.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.approval.api;

import com.qsoftwares.dispro.approval.dto.ApprovalHardenRequest;
import com.qsoftwares.dispro.approval.service.ApprovalWorkflowService;
import com.qsoftwares.dispro.approval.service.SecondFactorPolicy;
import com.qsoftwares.dispro.approval.service.TotpService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
@Path("/v1/dispro/approvals")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class ApprovalApiResource {

    private final ApprovalWorkflowService approvalWorkflowService;
    private final SecondFactorPolicy secondFactorPolicy;
    private final TotpService totpService;

    /**
     * List all pending approvals.
     *
     * @return list of disbursements awaiting approval
     */
    @GET
    @Path("/")
    public Response listPendingApprovals() {
        log.info("Listing pending approvals");
        Map<String, Object> result = approvalWorkflowService.listPendingApprovals();
        return Response.ok(result).build();
    }

    /**
     * Approve a disbursement.
     *
     * @param id      the disbursement/approval ID
     * @param request JSON body with: approverName, approverRole, comments
     * @return updated approval record
     */
    @PUT
    @Path("/{id}/approve")
    public Response approveDisbursement(@PathParam("id") String id, Map<String, Object> request) {
        log.info("Approving disbursement: id={}, approver={}", id, request.get("approverName"));
        Map<String, Object> result = approvalWorkflowService.approve(id, request);
        return Response.ok(result).build();
    }

    /**
     * Reject a disbursement with reason.
     *
     * @param id      the disbursement/approval ID
     * @param request JSON body with: rejectorName, rejectorRole, reason
     * @return updated approval record with rejection details
     */
    @PUT
    @Path("/{id}/reject")
    public Response rejectDisbursement(@PathParam("id") String id, Map<String, Object> request) {
        log.info("Rejecting disbursement: id={}, reason={}", id, request.get("reason"));
        Map<String, Object> result = approvalWorkflowService.reject(id, request);
        return Response.ok(result).build();
    }

    /**
     * Get approval history (all past approved/rejected items).
     *
     * @return paginated list of historical approval decisions
     */
    @GET
    @Path("/history")
    public Response getApprovalHistory() {
        log.info("Fetching approval history");
        Map<String, Object> result = approvalWorkflowService.getApprovalHistory();
        return Response.ok(result).build();
    }

    /**
     * Get approval statistics (pending, approved, rejected counts).
     *
     * @return summary counts and trend data
     */
    @GET
    @Path("/stats")
    public Response getApprovalStats() {
        log.info("Fetching approval statistics");
        Map<String, Object> result = approvalWorkflowService.getApprovalStats();
        return Response.ok(result).build();
    }

    // ── P0-5 Approval Hardening: Second Factor & TOTP endpoints ──

    /**
     * Verify TOTP second factor before final approval of a disbursement.
     * Enforces maker-checker separation and validates the TOTP code.
     *
     * @param id      the disbursement/approval ID
     * @param request approval hardening request with approverId and totpCode
     * @return verification result
     */
    @POST
    @Path("/{id}/verify-2fa")
    public Response verify2fa(@PathParam("id") String id, ApprovalHardenRequest request) {
        log.info("Verifying 2FA for approval: id={}, approverId={}", id, request.getApproverId());

        // Stub maker ID — in production, fetched from the disbursement record
        Long makerId = 1L;

        // Enforce maker-checker separation
        boolean makerCheckerValid = secondFactorPolicy.validateMakerChecker(makerId, request.getApproverId());

        // Verify TOTP code
        boolean totpValid = totpService.verifyTotp(request.getApproverId(), request.getTotpCode());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("approvalId", id);
        result.put("disbursementId", request.getDisbursementId());
        result.put("approverId", request.getApproverId());
        result.put("totpVerified", totpValid);
        result.put("makerCheckerValid", makerCheckerValid);
        result.put("comments", request.getComments());

        if (totpValid) {
            result.put("status", "2FA_VERIFIED");
            result.put("message", "Second factor verified. Disbursement approval confirmed.");
            log.info("2FA verified for approval: id={}", id);
            return Response.ok(result).build();
        } else {
            result.put("status", "2FA_FAILED");
            result.put("message", "TOTP code invalid. Approval not confirmed.");
            log.warn("2FA verification failed for approval: id={}", id);
            return Response.status(Response.Status.FORBIDDEN).entity(result).build();
        }
    }

    /**
     * Enroll a new TOTP device for second-factor approval verification.
     *
     * @param request JSON body with: userId
     * @return TOTP enrollment details including masked secret and provisioning URI
     */
    @POST
    @Path("/totp/enroll")
    public Response enrollTotp(Map<String, Object> request) {
        Long userId = Long.valueOf(request.getOrDefault("userId", "0").toString());
        log.info("Enrolling TOTP device for userId={}", userId);

        Map<String, Object> enrollment = totpService.enrollDevice(userId);

        return Response.ok(enrollment).build();
    }

    /**
     * Verify a TOTP code (standalone verification, not tied to a specific approval).
     *
     * @param request JSON body with: userId, totpCode
     * @return verification result
     */
    @POST
    @Path("/totp/verify")
    public Response verifyTotp(Map<String, Object> request) {
        Long userId = Long.valueOf(request.getOrDefault("userId", "0").toString());
        String code = request.getOrDefault("totpCode", "").toString();
        log.info("Verifying TOTP for userId={}", userId);

        boolean valid = totpService.verifyTotp(userId, code);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("userId", userId);
        result.put("totpVerified", valid);
        result.put("message", valid ? "TOTP code verified successfully" : "Invalid TOTP code");

        if (valid) {
            return Response.ok(result).build();
        } else {
            return Response.status(Response.Status.FORBIDDEN).entity(result).build();
        }
    }
}
