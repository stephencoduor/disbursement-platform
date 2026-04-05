/**
 * DisbursePro — Mobile Money Auto-Configuration
 * Spring Boot auto-configuration for the DisbursePro mobile money module.
 *
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.mobilemoney.starter;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.ComponentScan;

@AutoConfiguration
@ConditionalOnProperty(prefix = "dispro.mobilemoney", name = "enabled", havingValue = "true", matchIfMissing = true)
@ComponentScan(basePackages = "com.qsoftwares.dispro.mobilemoney")
public class MobileMoneyAutoConfiguration {

}
