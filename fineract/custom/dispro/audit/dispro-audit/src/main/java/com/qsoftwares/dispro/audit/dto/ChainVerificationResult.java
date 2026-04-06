package com.qsoftwares.dispro.audit.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChainVerificationResult {
    private String fromDate;
    private String toDate;
    private int totalEvents;
    private int validEvents;
    private List<Long> brokenLinks;
    private boolean chainIntact;
}
