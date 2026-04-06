/**
 * DisbursePro — Carrier Health Response DTO
 * Health status for a single mobile money carrier in Zambia.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.mobilemoney.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarrierHealthResponse {

    /** Carrier name: AIRTEL, MTN, or ZAMTEL */
    private String carrier;

    /** Success rate as a percentage (0.0 - 100.0) over the rolling window */
    private double successRate;

    /** 95th percentile latency in milliseconds over the rolling window */
    private long p95LatencyMs;

    /** Overall health score (0-100) combining success rate and latency */
    private int healthScore;

    /** Whether the carrier is considered healthy (score >= 50) */
    private boolean isHealthy;

    /** When the health metrics were last computed */
    private LocalDateTime lastCheckedAt;
}
