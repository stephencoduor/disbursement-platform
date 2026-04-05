/**
 * DisbursePro — Approval Workflow API Resource
 * Multi-tier approval endpoints for disbursement authorization in Zambia.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.approval.api;

import com.qsoftwares.dispro.approval.service.ApprovalWorkflowService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@Path("/v1/dispro/approvals")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class ApprovalApiResource {

    private final ApprovalWorkflowService approvalWorkflowService;

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
}
