/**
 * DisbursePro — KYB (Know Your Business) API Resource
 * JAX-RS endpoints for employer onboarding and verification in Zambia.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.kyb.api;

import com.qsoftwares.dispro.kyb.service.KybService;
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

import java.util.Map;

@Slf4j
@Component
@Path("/v1/dispro/kyb")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class KybApiResource {

    private final KybService kybService;

    @POST
    @Path("/employers")
    public Response registerEmployer(Map<String, Object> request) {
        log.info("KYB employer registration: legalName={}, tpin={}",
                request.get("legalName"), request.get("tpin"));
        Map<String, Object> result = kybService.registerEmployer(request);
        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @GET
    @Path("/employers/{id}/status")
    public Response getEmployerStatus(@PathParam("id") String id) {
        log.info("Fetching KYB status for employer: id={}", id);
        Map<String, Object> result = kybService.getEmployerStatus(id);
        return Response.ok(result).build();
    }

    @POST
    @Path("/employers/{id}/documents")
    public Response uploadDocument(@PathParam("id") String id, Map<String, Object> request) {
        log.info("KYB document upload: employerId={}, docType={}", id, request.get("docType"));
        Map<String, Object> result = kybService.uploadDocument(id, request);
        return Response.status(Response.Status.CREATED).entity(result).build();
    }
}
