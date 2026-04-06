package com.qsoftwares.dispro.audit.starter;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.ComponentScan;

@AutoConfiguration
@ConditionalOnProperty(prefix = "dispro.audit", name = "enabled", havingValue = "true", matchIfMissing = true)
@ComponentScan(basePackages = "com.qsoftwares.dispro.audit")
public class DisproAuditAutoConfiguration {}
