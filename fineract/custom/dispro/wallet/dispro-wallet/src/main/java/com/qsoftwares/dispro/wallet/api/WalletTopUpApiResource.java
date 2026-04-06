/**
 * DisbursePro — Wallet Top-Up API
 * JAX-RS endpoints for funding employer wallets via multiple channels.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.wallet.api;

import com.qsoftwares.dispro.wallet.topup.WalletTopUpService;
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

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Component
@Path("/v1/dispro/wallet")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class WalletTopUpApiResource {

    private final WalletTopUpService topUpService;

    /** Get wallet balance. */
    @GET @Path("/balance/{employerId}")
    public Response getBalance(@PathParam("employerId") long employerId) {
        return Response.ok(topUpService.getBalance(employerId)).build();
    }

    /** Top up via virtual account deposit. */
    @POST @Path("/topup/virtual-account")
    public Response topUpViaVirtualAccount(Map<String, Object> request) {
        long employerId = Long.parseLong(request.get("employerId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String reference = request.getOrDefault("reference", "").toString();
        return Response.ok(topUpService.topUpViaVirtualAccount(employerId, amount, reference)).build();
    }

    /** Top up via card payment. */
    @POST @Path("/topup/card")
    public Response topUpViaCard(Map<String, Object> request) {
        long employerId = Long.parseLong(request.get("employerId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String cardToken = request.getOrDefault("cardToken", "").toString();
        return Response.ok(topUpService.topUpViaCard(employerId, amount, cardToken)).build();
    }

    /** Top up via NFS (interbank transfer). */
    @POST @Path("/topup/nfs")
    public Response topUpViaNfs(Map<String, Object> request) {
        long employerId = Long.parseLong(request.get("employerId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String bankCode = request.getOrDefault("sourceBankCode", "").toString();
        String accountNumber = request.getOrDefault("sourceAccountNumber", "").toString();
        return Response.ok(topUpService.topUpViaNfs(employerId, amount, bankCode, accountNumber)).build();
    }

    /** Get top-up history. */
    @GET @Path("/topup/history/{employerId}")
    public Response getTopUpHistory(@PathParam("employerId") long employerId) {
        return Response.ok(topUpService.getTopUpHistory(employerId)).build();
    }
}
