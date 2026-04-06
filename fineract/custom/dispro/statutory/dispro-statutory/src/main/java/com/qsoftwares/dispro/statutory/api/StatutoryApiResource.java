/**
 * DisbursePro — Statutory Tax Engine API Resource
 * JAX-RS endpoints for Zambian 2025 statutory deduction calculations.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.api;

import com.qsoftwares.dispro.statutory.service.StatutoryCalculationService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@Path("/v1/dispro/statutory")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class StatutoryApiResource {

    private final StatutoryCalculationService statutoryCalculationService;

    /**
     * Calculate statutory deductions for a gross monthly salary.
     * Accepts gross salary in minor units (ngwee) and returns full PAYE/NAPSA/NHIMA/SDL breakdown.
     *
     * @param request PayrollCalculationRequest with grossSalary (ngwee) and optional currencyCode
     * @return PayrollCalculationResponse with net pay and all deduction amounts
     */
    @POST
    @Path("/calculate")
    public Response calculate(PayrollCalculationRequest request) {
        log.info("Statutory calculation request: grossSalary={} ngwee, currency={}",
                request.getGrossSalary(), request.getCurrencyCode());

        PayrollCalculationResponse response = statutoryCalculationService.calculate(request);
        return Response.ok(response).build();
    }

    /**
     * Return current 2025 Zambian PAYE income tax bands.
     *
     * @return list of bands with lower/upper bounds (ngwee), rate (bps), and human-readable values
     */
    @GET
    @Path("/bands/paye")
    public Response getPayeBands() {
        log.info("Fetching PAYE bands");
        List<Map<String, Object>> bands = statutoryCalculationService.getPayeBands();
        return Response.ok(bands).build();
    }

    /**
     * Return statutory ceilings and rates for NAPSA, NHIMA, and SDL.
     *
     * @return map with scheme details, rates (bps), ceilings (ngwee), and effective date
     */
    @GET
    @Path("/ceilings")
    public Response getCeilings() {
        log.info("Fetching statutory ceilings");
        Map<String, Object> ceilings = statutoryCalculationService.getCeilings();
        return Response.ok(ceilings).build();
    }
}
