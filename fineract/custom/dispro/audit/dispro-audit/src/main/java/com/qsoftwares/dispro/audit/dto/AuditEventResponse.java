package com.qsoftwares.dispro.audit.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditEventResponse {
    private Long id;
    private String entityType;
    private Long entityId;
    private String action;
    private Long userId;
    private String payloadJson;
    private String hashValue;
    private String previousHash;
    private boolean verified;
    private String createdAt;
}
