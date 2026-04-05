/**
 * DisbursePro — Wallet API Resource
 * Company custodial wallet management endpoints for Zambian mobile money disbursements.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.wallet.api;

import com.qsoftwares.dispro.wallet.service.WalletService;
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

import java.util.Map;

@Slf4j
@Component
@Path("/v1/dispro/wallet")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class WalletApiResource {

    private final WalletService walletService;

    /**
     * Get current wallet balance.
     *
     * @return wallet balance in ZMW with daily/monthly limits
     */
    @GET
    @Path("/balance")
    public Response getBalance() {
        log.info("Fetching wallet balance");
        Map<String, Object> result = walletService.getBalance();
        return Response.ok(result).build();
    }

    /**
     * Top up the company wallet.
     *
     * @param request JSON body with: amount, source (BANK_TRANSFER, CHEQUE), reference
     * @return top-up confirmation with updated balance
     */
    @POST
    @Path("/topup")
    public Response topUpWallet(Map<String, Object> request) {
        log.info("Topping up wallet: amount=ZMW {}, source={}", request.get("amount"), request.get("source"));
        Map<String, Object> result = walletService.topUp(request);
        return Response.ok(result).build();
    }

    /**
     * Get wallet transaction history.
     *
     * @return paginated list of wallet transactions (top-ups, disbursements, fees)
     */
    @GET
    @Path("/transactions")
    public Response getTransactionHistory() {
        log.info("Fetching wallet transaction history");
        Map<String, Object> result = walletService.getTransactionHistory();
        return Response.ok(result).build();
    }

    /**
     * Check remaining daily disbursement limit.
     *
     * @return daily limit, used amount, and remaining amount in ZMW
     */
    @GET
    @Path("/daily-limit")
    public Response getDailyLimit() {
        log.info("Checking daily disbursement limit");
        Map<String, Object> result = walletService.getDailyLimit();
        return Response.ok(result).build();
    }

    /**
     * Get monthly spend summary.
     *
     * @return monthly totals by category, carrier, and overall spend in ZMW
     */
    @GET
    @Path("/monthly-summary")
    public Response getMonthlySummary() {
        log.info("Fetching monthly spend summary");
        Map<String, Object> result = walletService.getMonthlySummary();
        return Response.ok(result).build();
    }
}
