package com.qsoftwares.dispro.audit.api;

import com.qsoftwares.dispro.audit.dto.AuditEventResponse;
import com.qsoftwares.dispro.audit.dto.ChainVerificationResult;
import com.qsoftwares.dispro.audit.service.AuditHashChainService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j @Component
@Path("/v1/dispro/audit")
@Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class AuditApiResource {

    private final AuditHashChainService auditService;

    @GET @Path("/events")
    public Response listEvents(@QueryParam("entityType") String entityType,
                               @QueryParam("action") String action,
                               @QueryParam("limit") @DefaultValue("50") int limit) {
        List<AuditEventResponse> events = auditService.listEvents(entityType, action, limit);
        return Response.ok(Map.of("events", events, "totalCount", events.size(),
            "latestHash", auditService.getLatestHash())).build();
    }

    @GET @Path("/events/{id}")
    public Response getEvent(@PathParam("id") Long id) {
        // Stub: return a sample event
        AuditEventResponse event = auditService.recordEvent("SAMPLE", id, "READ", 1L, "{}");
        return Response.ok(event).build();
    }

    @POST @Path("/events/verify-chain")
    public Response verifyChain(Map<String, Object> request) {
        String from = (String) request.getOrDefault("fromDate", "2026-01-01");
        String to = (String) request.getOrDefault("toDate", "2026-12-31");
        ChainVerificationResult result = auditService.verifyChain(from, to);
        return Response.ok(result).build();
    }
}
