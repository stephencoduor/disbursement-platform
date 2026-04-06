package com.qsoftwares.dispro.approval.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j @Service
public class SecondFactorPolicy {

    private static final long TIER_2_THRESHOLD_MINOR = 5_000_000L;  // ZMW 50,000
    private static final long TIER_3_THRESHOLD_MINOR = 50_000_000L; // ZMW 500,000

    public boolean validateMakerChecker(Long makerId, Long checkerId) {
        if (makerId.equals(checkerId)) {
            log.warn("Maker-checker violation: same user {} attempted both roles", makerId);
            return false;
        }
        return true;
    }

    public boolean requireSecondFactor(int approvalTier, long amountMinor) {
        if (approvalTier >= 3) return true;
        if (approvalTier == 2 && amountMinor >= TIER_2_THRESHOLD_MINOR) return true;
        if (amountMinor >= TIER_3_THRESHOLD_MINOR) return true;
        return false;
    }

    public String determineApprovalTier(long amountMinor) {
        if (amountMinor >= TIER_3_THRESHOLD_MINOR) return "TIER_3_EXECUTIVE";
        if (amountMinor >= TIER_2_THRESHOLD_MINOR) return "TIER_2_MANAGER";
        return "TIER_1_OPERATOR";
    }
}
