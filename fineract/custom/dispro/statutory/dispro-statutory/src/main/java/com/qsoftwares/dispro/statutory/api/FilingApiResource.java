/**
 * DisbursePro — Statutory Filing API Resource
 * Provides endpoints for generating, previewing, and submitting statutory returns.
 * Routes: /v1/dispro/statutory/filings/*
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.api;

import com.qsoftwares.dispro.statutory.filing.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Path("/v1/dispro/statutory/filings")
@Component
@RequiredArgsConstructor
@Slf4j
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FilingApiResource {

    private final PayeReturnGenerator payeGenerator;
    private final NapsaScheduleGenerator napsaGenerator;
    private final NhimaReturnGenerator nhimaGenerator;
    private final FilingHistoryService historyService;

    /**
     * Generate a PAYE return preview (does not submit to ZRA).
     */
    @POST
    @Path("/paye/generate")
    @SuppressWarnings("unchecked")
    public Response generatePayeReturn(Map<String, Object> request) {
        String tpin = (String) request.get("employerTpin");
        String period = (String) request.get("period");
        List<Map<String, Object>> employees = (List<Map<String, Object>>) request.get("employees");

        log.info("Generating PAYE return: tpin={}, period={}, employees={}", tpin, period, employees.size());
        Map<String, Object> result = payeGenerator.generatePayeReturn(tpin, period, employees);
        return Response.ok(result).build();
    }

    /**
     * Generate a NAPSA Schedule 1 preview.
     */
    @POST
    @Path("/napsa/generate")
    @SuppressWarnings("unchecked")
    public Response generateNapsaSchedule(Map<String, Object> request) {
        String employerNumber = (String) request.get("employerNumber");
        String period = (String) request.get("period");
        List<Map<String, Object>> employees = (List<Map<String, Object>>) request.get("employees");

        log.info("Generating NAPSA Schedule 1: employer={}, period={}, employees={}", employerNumber, period, employees.size());
        Map<String, Object> result = napsaGenerator.generateSchedule1(employerNumber, period, employees);
        return Response.ok(result).build();
    }

    /**
     * Generate a NHIMA return preview.
     */
    @POST
    @Path("/nhima/generate")
    @SuppressWarnings("unchecked")
    public Response generateNhimaReturn(Map<String, Object> request) {
        String employerCode = (String) request.get("employerCode");
        String period = (String) request.get("period");
        List<Map<String, Object>> employees = (List<Map<String, Object>>) request.get("employees");

        log.info("Generating NHIMA return: employer={}, period={}", employerCode, period);
        Map<String, Object> result = nhimaGenerator.generateReturn(employerCode, period, employees);
        return Response.ok(result).build();
    }

    /**
     * Get filing history for an employer.
     */
    @GET
    @Path("/history")
    public Response getFilingHistory(@QueryParam("employerTpin") String employerTpin) {
        List<Map<String, Object>> history = historyService.getFilingHistory(employerTpin);
        return Response.ok(history).build();
    }

    /**
     * Get a single filing record.
     */
    @GET
    @Path("/history/{filingId}")
    public Response getFiling(@PathParam("filingId") String filingId) {
        return Response.ok(historyService.getFiling(filingId)).build();
    }
}
