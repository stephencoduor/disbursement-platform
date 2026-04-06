/**
 * DisbursePro — Carrier Failover API Resource
 * Extends mobile money module with failover configuration, alternate MSISDN management,
 * and disbursement retry execution.
 * Routes: /v1/dispro/mobilemoney/failover/*
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.mobilemoney.api;

import com.qsoftwares.dispro.mobilemoney.dto.AlternateMsisdnRequest;
import com.qsoftwares.dispro.mobilemoney.service.CarrierHealthMonitor;
import com.qsoftwares.dispro.mobilemoney.service.CarrierRouter;
import com.qsoftwares.dispro.mobilemoney.service.RetryPolicy;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Path("/v1/dispro/mobilemoney/failover")
@Component
@RequiredArgsConstructor
@Slf4j
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CarrierFailoverApiResource {

    private final CarrierRouter carrierRouter;
    private final CarrierHealthMonitor healthMonitor;
    private final RetryPolicy retryPolicy;

    // In-memory alternate MSISDN store (production: database)
    private final ConcurrentHashMap<String, String> alternateMsisdns = new ConcurrentHashMap<>();

    /**
     * Execute a disbursement with retry and failover.
     */
    @POST
    @Path("/disburse")
    public Response disburseWithRetry(Map<String, Object> request) {
        String msisdn = (String) request.get("msisdn");
        long amountNgwee = ((Number) request.get("amountNgwee")).longValue();
        String reference = (String) request.getOrDefault("reference", "DIS-" + System.currentTimeMillis());

        Map<String, Object> result = retryPolicy.executeWithRetry(msisdn, amountNgwee, reference);
        int status = "SUCCESS".equals(result.get("status")) ? 201 : 502;
        return Response.status(status).entity(result).build();
    }

    /**
     * Register an alternate MSISDN for an employee.
     */
    @POST
    @Path("/alternate-msisdn")
    public Response registerAlternateMsisdn(AlternateMsisdnRequest request) {
        log.info("Alternate MSISDN: employee={}, primary={}, alternate={}, carrier={}",
            request.getEmployeeId(), request.getPrimaryMsisdn(),
            request.getAlternateMsisdn(), request.getAlternateCarrier());

        alternateMsisdns.put(request.getEmployeeId(), request.getAlternateMsisdn());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("employeeId", request.getEmployeeId());
        result.put("alternateMsisdn", request.getAlternateMsisdn());
        result.put("alternateCarrier", request.getAlternateCarrier());
        result.put("status", "REGISTERED");
        return Response.ok(result).build();
    }

    /**
     * Get carrier health dashboard data.
     */
    @GET
    @Path("/health")
    public Response getCarrierHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        for (String carrier : List.of("AIRTEL", "MTN", "ZAMTEL")) {
            Map<String, Object> stats = new LinkedHashMap<>();
            stats.put("carrier", carrier);
            stats.put("healthScore", healthMonitor.getHealthScore(carrier));
            stats.put("successRate", healthMonitor.getSuccessRate(carrier));
            stats.put("p95LatencyMs", healthMonitor.getP95Latency(carrier));
            stats.put("sampleCount", healthMonitor.getSampleCount(carrier));
            health.put(carrier, stats);
        }
        return Response.ok(health).build();
    }

    /**
     * Get routing audit log (last 50 entries).
     */
    @GET
    @Path("/routing-log")
    public Response getRoutingLog() {
        return Response.ok(carrierRouter.getRoutingLog()).build();
    }
}
