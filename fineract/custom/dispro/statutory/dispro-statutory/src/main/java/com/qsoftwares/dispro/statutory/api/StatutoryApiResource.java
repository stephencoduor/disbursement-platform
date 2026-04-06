/**
 * DisbursePro — Statutory Tax API Resource
 * JAX-RS endpoints for Zambian payroll statutory deduction calculations.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.api;

import com.qsoftwares.dispro.statutory.dto.PayrollCalculationRequest;
import com.qsoftwares.dispro.statutory.dto.PayrollCalculationResponse;
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

    private final StatutoryCalculationService calculationService;

    /**
     * Calculate PAYE, NAPSA, NHIMA, and SDL for a given gross salary.
     *
     * @param request JSON with grossSalaryMinor (ngwee), currencyCode, periodMonth
     * @return full statutory deduction breakdown
     */
    @POST
    @Path("/calculate")
    public Response calculate(PayrollCalculationRequest request) {
        log.info("Statutory calculation request: gross={} ngwee, currency={}",
                request.getGrossSalaryMinor(), request.getCurrencyCode());
        PayrollCalculationResponse result = calculationService.calculate(request);
        return Response.ok(result).build();
    }

    /**
     * Return the current Zambian PAYE tax bands (2025).
     */
    @GET
    @Path("/bands/paye")
    public Response getPayeBands() {
        log.info("Fetching PAYE bands");
        List<Map<String, Object>> bands = calculationService.getPayeBands();
        return Response.ok(Map.of("country", "ZM", "effectiveFrom", "2025-01-01", "bands", bands)).build();
    }

    /**
     * Return NAPSA ceiling, NHIMA rate, and SDL rate.
     */
    @GET
    @Path("/ceilings")
    public Response getCeilings() {
        log.info("Fetching statutory ceilings and rates");
        Map<String, Object> ceilings = calculationService.getCeilings();
        return Response.ok(ceilings).build();
    }
}
