/**
 * DisbursePro — Mobile Money API Resource
 * Carrier integration endpoints for Airtel Money, MTN MoMo, and Zamtel Kwacha in Zambia.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.mobilemoney.api;

import com.qsoftwares.dispro.mobilemoney.service.AirtelMoneyService;
import com.qsoftwares.dispro.mobilemoney.service.MtnMomoService;
import com.qsoftwares.dispro.mobilemoney.service.ZamtelKwachaService;
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
@Path("/v1/dispro/mobilemoney")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class MobileMoneyApiResource {

    private final AirtelMoneyService airtelMoneyService;
    private final MtnMomoService mtnMomoService;
    private final ZamtelKwachaService zamtelKwachaService;

    /**
     * Send money to a phone number via the specified carrier.
     *
     * @param request JSON body with: phoneNumber (+260), amount (ZMW), carrier, reference
     * @return transaction result with carrier reference ID
     */
    @POST
    @Path("/send")
    public Response sendMoney(Map<String, Object> request) {
        String carrier = request.getOrDefault("carrier", "AIRTEL").toString().toUpperCase();
        log.info("Sending money via {}: phone={}, amount=ZMW {}",
                carrier, request.get("phoneNumber"), request.get("amount"));

        Map<String, Object> result = switch (carrier) {
            case "MTN" -> mtnMomoService.disburse(request);
            case "ZAMTEL" -> zamtelKwachaService.sendMoney(request);
            default -> airtelMoneyService.disburseB2C(request);
        };

        return Response.ok(result).build();
    }

    /**
     * Carrier callback webhook — receives async status updates from carriers.
     *
     * @param carrier the carrier name (airtel, mtn, zamtel)
     * @param payload the callback payload from the carrier
     * @return acknowledgement
     */
    @POST
    @Path("/callback/{carrier}")
    public Response carrierCallback(@PathParam("carrier") String carrier, Map<String, Object> payload) {
        log.info("Received callback from carrier={}: payload={}", carrier, payload);

        Map<String, Object> result = switch (carrier.toLowerCase()) {
            case "mtn" -> mtnMomoService.handleCallback(payload);
            case "zamtel" -> zamtelKwachaService.handleCallback(payload);
            default -> airtelMoneyService.handleCallback(payload);
        };

        return Response.ok(result).build();
    }

    /**
     * Get the company wallet balance across all carriers.
     *
     * @return balance per carrier and total balance in ZMW
     */
    @GET
    @Path("/balance")
    public Response getBalance() {
        log.info("Fetching company wallet balance across carriers");

        Map<String, Object> result = Map.of(
                "currency", "ZMW",
                "airtel", airtelMoneyService.getBalance(),
                "mtn", mtnMomoService.getBalance(),
                "zamtel", zamtelKwachaService.getBalance(),
                "totalBalance", "485000.00",
                "lastUpdated", "2026-04-05T10:30:00"
        );

        return Response.ok(result).build();
    }

    /**
     * Check transaction status by carrier transaction ID.
     *
     * @param transactionId the carrier-specific transaction reference
     * @return transaction status details
     */
    @GET
    @Path("/status/{transactionId}")
    public Response getTransactionStatus(@PathParam("transactionId") String transactionId) {
        log.info("Checking transaction status: transactionId={}", transactionId);

        // Determine carrier from prefix convention
        Map<String, Object> result;
        if (transactionId.startsWith("MTN")) {
            result = mtnMomoService.getTransactionStatus(transactionId);
        } else if (transactionId.startsWith("ZMT")) {
            result = zamtelKwachaService.getTransactionStatus(transactionId);
        } else {
            result = airtelMoneyService.getTransactionStatus(transactionId);
        }

        return Response.ok(result).build();
    }
}
