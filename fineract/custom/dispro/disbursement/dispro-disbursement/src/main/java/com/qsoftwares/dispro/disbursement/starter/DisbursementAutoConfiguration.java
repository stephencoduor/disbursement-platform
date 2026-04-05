/**
 * DisbursePro — Disbursement Auto-Configuration
 * Spring Boot auto-configuration for the DisbursePro disbursement module.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.disbursement.starter;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.ComponentScan;

@AutoConfiguration
@ConditionalOnProperty(prefix = "dispro.disbursement", name = "enabled", havingValue = "true", matchIfMissing = true)
@ComponentScan(basePackages = "com.qsoftwares.dispro.disbursement")
public class DisbursementAutoConfiguration {

}
