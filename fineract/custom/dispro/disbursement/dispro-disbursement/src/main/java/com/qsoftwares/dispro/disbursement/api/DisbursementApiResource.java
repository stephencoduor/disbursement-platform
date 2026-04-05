/**
 * DisbursePro — Disbursement API Resource
 * Mobile money disbursement endpoints for Zambia (ZMW).
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.disbursement.api;

import com.qsoftwares.dispro.disbursement.service.DisbursementService;
import com.qsoftwares.dispro.disbursement.service.FeeCalculationService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@Path("/v1/dispro/disbursements")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class DisbursementApiResource {

    private final DisbursementService disbursementService;
    private final FeeCalculationService feeCalculationService;

    /**
     * Create a single disbursement to an employee via mobile money.
     *
     * @param request JSON body with: employeeName, phoneNumber (+260), amount (ZMW),
     *                carrier (AIRTEL|MTN|ZAMTEL), purpose, intent
     * @return created disbursement with ID and status
     */
    @POST
    @Path("/single")
    public Response createSingleDisbursement(Map<String, Object> request) {
        log.info("Creating single disbursement: employee={}, carrier={}, amount=ZMW {}",
                request.get("employeeName"), request.get("carrier"), request.get("amount"));
        Map<String, Object> result = disbursementService.createSingleDisbursement(request);
        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    /**
     * Create a bulk disbursement from a CSV batch upload.
     *
     * @param request JSON body with: batchName, description, disbursements (array)
     * @return batch summary with ID and individual disbursement statuses
     */
    @POST
    @Path("/bulk")
    public Response createBulkDisbursement(Map<String, Object> request) {
        log.info("Creating bulk disbursement: batchName={}", request.get("batchName"));
        Map<String, Object> result = disbursementService.createBulkDisbursement(request);
        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    /**
     * Get disbursement details by ID.
     *
     * @param id the disbursement identifier
     * @return disbursement details including status, fees, and carrier response
     */
    @GET
    @Path("/{id}")
    public Response getDisbursement(@PathParam("id") String id) {
        log.info("Fetching disbursement: id={}", id);
        Map<String, Object> result = disbursementService.getDisbursement(id);
        return Response.ok(result).build();
    }

    /**
     * List disbursements with optional filters.
     *
     * @param status filter by status (PENDING, APPROVED, PROCESSING, COMPLETED, FAILED, CANCELLED)
     * @param dateFrom start date filter (ISO-8601)
     * @param dateTo end date filter (ISO-8601)
     * @param carrier filter by carrier (AIRTEL, MTN, ZAMTEL)
     * @return paginated list of disbursements
     */
    @GET
    @Path("/")
    public Response listDisbursements(
            @QueryParam("status") String status,
            @QueryParam("dateFrom") String dateFrom,
            @QueryParam("dateTo") String dateTo,
            @QueryParam("carrier") String carrier) {
        log.info("Listing disbursements: status={}, carrier={}, dateFrom={}, dateTo={}",
                status, carrier, dateFrom, dateTo);
        Map<String, Object> result = disbursementService.listDisbursements(status, dateFrom, dateTo, carrier);
        return Response.ok(result).build();
    }

    /**
     * Get fee breakdown for a specific disbursement.
     *
     * @param id the disbursement identifier
     * @return fee breakdown: netAmount, carrierFee, platformFee, levy, grossAmount
     */
    @GET
    @Path("/{id}/fees")
    public Response getFeeBreakdown(@PathParam("id") String id) {
        log.info("Fetching fee breakdown for disbursement: id={}", id);
        Map<String, Object> result = feeCalculationService.getFeeBreakdownForDisbursement(id);
        return Response.ok(result).build();
    }

    /**
     * Cancel a pending disbursement.
     *
     * @param id the disbursement identifier
     * @return updated disbursement with CANCELLED status
     */
    @PUT
    @Path("/{id}/cancel")
    public Response cancelDisbursement(@PathParam("id") String id) {
        log.info("Cancelling disbursement: id={}", id);
        Map<String, Object> result = disbursementService.cancelDisbursement(id);
        return Response.ok(result).build();
    }
}
