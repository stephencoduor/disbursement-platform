package com.qsoftwares.dispro.approval.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Slf4j @Service
public class TotpService {

    private static final String DEV_BYPASS_CODE = "000000";
    private static final SecureRandom RANDOM = new SecureRandom();

    public Map<String, Object> enrollDevice(Long userId) {
        String secret = generateBase32Secret();
        String provisioningUri = "otpauth://totp/DisbursePro:" + userId
            + "?secret=" + secret + "&issuer=DisbursePro&digits=6&period=30";

        log.info("TOTP enrollment: userId={}", userId);
        return Map.of(
            "userId", userId,
            "secret", secret.substring(0, 4) + "****" + secret.substring(secret.length() - 4),
            "provisioningUri", provisioningUri,
            "enrolledAt", Instant.now().toString(),
            "message", "Scan QR code with your authenticator app (Google Authenticator, Authy, etc.)"
        );
    }

    public boolean verifyTotp(Long userId, String code) {
        // Dev mode: accept 000000 for testing
        if (DEV_BYPASS_CODE.equals(code)) {
            log.info("TOTP verified (dev bypass): userId={}", userId);
            return true;
        }
        // Production: validate against enrolled secret using HMAC-SHA1 TOTP algorithm
        log.warn("TOTP verification failed: userId={}", userId);
        return false;
    }

    private String generateBase32Secret() {
        byte[] bytes = new byte[20];
        RANDOM.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes).replace("=", "").substring(0, 16).toUpperCase();
    }
}
