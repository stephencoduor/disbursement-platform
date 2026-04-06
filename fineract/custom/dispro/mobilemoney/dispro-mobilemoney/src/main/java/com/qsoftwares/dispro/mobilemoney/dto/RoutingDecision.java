/**
 * DisbursePro — Routing Decision DTO
 * Result of the carrier routing decision for a mobile money disbursement.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.mobilemoney.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutingDecision {

    /** The carrier selected for the disbursement: AIRTEL, MTN, or ZAMTEL */
    private String selectedCarrier;

    /** Reason for the selection: PREFIX_MATCH, FAILOVER, or LEAST_COST */
    private String reason;

    /** Alternate carrier if the selected one fails */
    private String alternateCarrier;

    /** Health scores for all carriers at decision time */
    private Map<String, Integer> healthScores;
}
