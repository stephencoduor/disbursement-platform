package com.qsoftwares.dispro.mobilemoney.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j @Service
public class CarrierHealthMonitor {

    private static final int WINDOW_SIZE = 100;
    private static final int HEALTH_THRESHOLD = 50;

    private final Map<String, List<long[]>> windows = new ConcurrentHashMap<>();

    public CarrierHealthMonitor() {
        // Initialize with healthy baselines for all Zambian carriers
        for (String carrier : List.of("AIRTEL", "MTN", "ZAMTEL")) {
            List<long[]> window = new CopyOnWriteArrayList<>();
            for (int i = 0; i < 20; i++) {
                window.add(new long[]{1, 200}); // success=1, latency=200ms
            }
            windows.put(carrier, window);
        }
    }

    public void recordOutcome(String carrier, boolean success, long latencyMs) {
        List<long[]> window = windows.computeIfAbsent(carrier, k -> new CopyOnWriteArrayList<>());
        window.add(new long[]{success ? 1 : 0, latencyMs});
        while (window.size() > WINDOW_SIZE) window.remove(0);
        log.debug("Carrier {} outcome: success={}, latency={}ms, healthScore={}",
            carrier, success, latencyMs, getHealthScore(carrier));
    }

    public int getHealthScore(String carrier) {
        List<long[]> window = windows.get(carrier);
        if (window == null || window.isEmpty()) return 0;
        long successes = window.stream().filter(r -> r[0] == 1).count();
        return (int) (successes * 100 / window.size());
    }

    public boolean isHealthy(String carrier) {
        return getHealthScore(carrier) >= HEALTH_THRESHOLD;
    }

    public String getHealthiestCarrier() {
        return windows.keySet().stream()
            .max(Comparator.comparingInt(this::getHealthScore))
            .orElse("AIRTEL");
    }

    public double getSuccessRate(String carrier) {
        List<long[]> window = windows.get(carrier);
        if (window == null || window.isEmpty()) return 0;
        long successes = window.stream().filter(r -> r[0] == 1).count();
        return (double) successes / window.size() * 100.0;
    }

    public long getP95Latency(String carrier) {
        List<long[]> window = windows.get(carrier);
        if (window == null || window.isEmpty()) return 0;
        return window.stream().mapToLong(r -> r[1]).sorted()
            .skip((long) (window.size() * 0.95)).findFirst().orElse(0);
    }

    public int getSampleCount(String carrier) {
        List<long[]> window = windows.get(carrier);
        return window == null ? 0 : window.size();
    }

    public Map<String, Object> getAllHealthScores() {
        Map<String, Object> scores = new LinkedHashMap<>();
        for (String carrier : List.of("AIRTEL", "MTN", "ZAMTEL")) {
            List<long[]> window = windows.getOrDefault(carrier, List.of());
            long p95 = window.stream().mapToLong(r -> r[1]).sorted()
                .skip((long)(window.size() * 0.95)).findFirst().orElse(0);
            scores.put(carrier, Map.of(
                "healthScore", getHealthScore(carrier),
                "isHealthy", isHealthy(carrier),
                "sampleSize", window.size(),
                "p95LatencyMs", p95,
                "lastUpdated", Instant.now().toString()
            ));
        }
        return scores;
    }
}
