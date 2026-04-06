package com.qsoftwares.dispro.audit.service;

import com.qsoftwares.dispro.audit.dto.AuditEventResponse;
import com.qsoftwares.dispro.audit.dto.ChainVerificationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j @Service
public class AuditHashChainService {

    private final List<AuditEventResponse> eventStore = new CopyOnWriteArrayList<>();
    private String latestHash = "GENESIS";

    public AuditEventResponse recordEvent(String entityType, Long entityId, String action, Long userId, String payload) {
        String previousHash = latestHash;
        String input = previousHash + "|" + entityType + "|" + entityId + "|" + action + "|" + payload + "|" + Instant.now();
        String hash = sha256(input);

        AuditEventResponse event = AuditEventResponse.builder()
            .id((long) eventStore.size() + 1)
            .entityType(entityType).entityId(entityId).action(action).userId(userId)
            .payloadJson(payload).hashValue(hash).previousHash(previousHash)
            .verified(true).createdAt(Instant.now().toString())
            .build();

        eventStore.add(event);
        latestHash = hash;
        log.info("Audit event recorded: entity={}:{}, action={}, hash={}", entityType, entityId, action, hash.substring(0, 12));
        return event;
    }

    public ChainVerificationResult verifyChain(String fromDate, String toDate) {
        int total = eventStore.size();
        int valid = 0;
        List<Long> broken = new ArrayList<>();

        for (int i = 0; i < eventStore.size(); i++) {
            AuditEventResponse e = eventStore.get(i);
            if (i == 0) { valid++; continue; }
            if (eventStore.get(i - 1).getHashValue().equals(e.getPreviousHash())) {
                valid++;
            } else {
                broken.add(e.getId());
            }
        }

        return ChainVerificationResult.builder()
            .fromDate(fromDate).toDate(toDate).totalEvents(total)
            .validEvents(valid).brokenLinks(broken).chainIntact(broken.isEmpty())
            .build();
    }

    public List<AuditEventResponse> listEvents(String entityType, String action, int limit) {
        return eventStore.stream()
            .filter(e -> entityType == null || e.getEntityType().equals(entityType))
            .filter(e -> action == null || e.getAction().equals(action))
            .sorted(Comparator.comparing(AuditEventResponse::getId).reversed())
            .limit(limit > 0 ? limit : 50)
            .toList();
    }

    public String getLatestHash() { return latestHash; }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
