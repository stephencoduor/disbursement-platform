/**
 * DisbursePro — KYB Live API
 * JAX-RS endpoints for PACRA verification, sanctions screening, and annual refresh.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.kyb.api;

import com.qsoftwares.dispro.kyb.pacra.PacraVerificationService;
import com.qsoftwares.dispro.kyb.sanctions.SanctionsScreeningService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
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
@Path("/v1/dispro/kyb/live")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class KybLiveApiResource {

    private final PacraVerificationService pacraService;
    private final SanctionsScreeningService sanctionsService;

    /** Verify company registration with PACRA. */
    @POST @Path("/verify-company")
    public Response verifyCompany(Map<String, String> request) {
        String regNumber = request.get("registrationNumber");
        if (regNumber == null || regNumber.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "registrationNumber is required")).build();
        }
        return Response.ok(pacraService.verifyCompany(regNumber)).build();
    }

    /** Check annual return filing status. */
    @GET @Path("/annual-return/{registrationNumber}")
    public Response checkAnnualReturn(@PathParam("registrationNumber") String registrationNumber) {
        return Response.ok(pacraService.checkAnnualReturn(registrationNumber)).build();
    }

    /** Trigger annual KYB refresh. */
    @POST @Path("/annual-refresh")
    public Response triggerAnnualRefresh(Map<String, String> request) {
        String regNumber = request.get("registrationNumber");
        return Response.ok(pacraService.triggerAnnualRefresh(regNumber)).build();
    }

    /** Screen an individual against sanctions lists. */
    @POST @Path("/screen")
    public Response screenIndividual(Map<String, String> request) {
        return Response.ok(sanctionsService.screen(
            request.getOrDefault("name", ""),
            request.getOrDefault("nationality", ""),
            request.get("idNumber")
        )).build();
    }

    /** Screen all directors of an employer. */
    @POST @Path("/screen-directors")
    public Response screenDirectors(List<Map<String, String>> directors) {
        return Response.ok(sanctionsService.screenDirectors(directors)).build();
    }

    /** Get sanctions list statistics. */
    @GET @Path("/sanctions-stats")
    public Response getSanctionsStats() {
        return Response.ok(sanctionsService.getListStats()).build();
    }
}
