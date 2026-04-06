package com.qsoftwares.dispro.mobilemoney.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j @Service @RequiredArgsConstructor
public class CarrierRouter {

    private final CarrierHealthMonitor healthMonitor;

    private static final Map<String, String> PREFIX_MAP = Map.of(
        "097", "AIRTEL", "077", "AIRTEL",
        "096", "MTN", "076", "MTN",
        "095", "ZAMTEL", "075", "ZAMTEL"
    );

    public Map<String, Object> selectCarrier(String recipientMsisdn, String preferredCarrier) {
        String normalized = recipientMsisdn.replace("+260", "0").replaceAll("[^0-9]", "");
        String prefix = normalized.length() >= 3 ? normalized.substring(0, 3) : "";
        String detectedCarrier = PREFIX_MAP.getOrDefault(prefix, "UNKNOWN");

        String selected;
        String reason;

        if (preferredCarrier != null && healthMonitor.isHealthy(preferredCarrier)) {
            selected = preferredCarrier;
            reason = "PREFERRED";
        } else if (healthMonitor.isHealthy(detectedCarrier)) {
            selected = detectedCarrier;
            reason = "PREFIX_MATCH";
        } else {
            // Failover to healthiest carrier
            selected = healthMonitor.getHealthiestCarrier();
            reason = "FAILOVER";
            log.warn("Carrier failover: {} unhealthy, routing to {}", detectedCarrier, selected);
        }

        return Map.of(
            "recipientMsisdn", recipientMsisdn, "detectedCarrier", detectedCarrier,
            "selectedCarrier", selected, "reason", reason,
            "alternateCarrier", selected.equals(detectedCarrier) ? getAlternate(detectedCarrier) : detectedCarrier,
            "healthScores", healthMonitor.getAllHealthScores()
        );
    }

    public void recordOutcome(String carrier, boolean success, long latencyMs) {
        healthMonitor.recordOutcome(carrier, success, latencyMs);
    }

    private String getAlternate(String carrier) {
        return switch (carrier) {
            case "AIRTEL" -> "MTN";
            case "MTN" -> "AIRTEL";
            case "ZAMTEL" -> "AIRTEL";
            default -> "AIRTEL";
        };
    }
}
