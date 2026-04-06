package com.qsoftwares.dispro.approval.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApprovalHardenRequest {
    private Long disbursementId;
    private Long approverId;
    private String totpCode;
    private String comments;
}
