package com.qsoftwares.dispro.approval.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TotpEnrollResponse {
    private Long userId;
    private String secret;
    private String provisioningUri;
    private String enrolledAt;
}
