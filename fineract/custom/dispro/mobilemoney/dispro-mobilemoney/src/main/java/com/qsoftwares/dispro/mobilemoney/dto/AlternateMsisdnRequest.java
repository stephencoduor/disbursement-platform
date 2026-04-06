/**
 * DisbursePro — Alternate MSISDN capture DTO.
 * Allows employees to register secondary phone numbers on different carriers
 * for failover routing.
 */
package com.qsoftwares.dispro.mobilemoney.dto;

import lombok.Data;

@Data
public class AlternateMsisdnRequest {
    private String employeeId;
    private String primaryMsisdn;
    private String alternateMsisdn;
    private String alternateCarrier; // AIRTEL, MTN, ZAMTEL
}
