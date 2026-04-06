/**
 * DisbursePro — ZRA PAYE Return File Generator
 * Generates the TPIN-based PAYE monthly return file for submission to ZRA TaxOnline.
 * Format: CSV with columns per ZRA specification.
 * Copyright (c) 2026 Qsoftwares Ltd. All rights reserved.
 */
package com.qsoftwares.dispro.statutory.filing;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Slf4j
public class PayeReturnGenerator {

    private static final String[] PAYE_HEADERS = {
        "Employee_NRC", "Employee_Name", "Gross_Salary_ZMW",
        "Taxable_Income_ZMW", "PAYE_Tax_ZMW", "Tax_Period",
        "Employer_TPIN", "Submission_Date"
    };

    /**
     * Generate a PAYE return CSV for a given employer and period.
     *
     * @param employerTpin employer's TPIN
     * @param period tax period (YYYY-MM)
     * @param employees list of employee payroll records
     * @return Map with csv content, filename, record count, and total PAYE
     */
    public Map<String, Object> generatePayeReturn(String employerTpin, String period, List<Map<String, Object>> employees) {
        StringBuilder csv = new StringBuilder();
        csv.append(String.join(",", PAYE_HEADERS)).append("\n");

        long totalPayeNgwee = 0;
        String submissionDate = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

        for (Map<String, Object> emp : employees) {
            String nrc = (String) emp.getOrDefault("nrc", "");
            String name = (String) emp.getOrDefault("name", "");
            long grossNgwee = ((Number) emp.getOrDefault("grossNgwee", 0)).longValue();
            long taxableNgwee = ((Number) emp.getOrDefault("taxableNgwee", 0)).longValue();
            long payeNgwee = ((Number) emp.getOrDefault("payeNgwee", 0)).longValue();
            totalPayeNgwee += payeNgwee;

            csv.append(String.format("%s,%s,%.2f,%.2f,%.2f,%s,%s,%s\n",
                nrc, name,
                grossNgwee / 100.0, taxableNgwee / 100.0, payeNgwee / 100.0,
                period, employerTpin, submissionDate));
        }

        String filename = String.format("PAYE_RETURN_%s_%s.csv", employerTpin, period.replace("-", ""));

        log.info("Generated PAYE return: employer={}, period={}, employees={}, totalPAYE=ZMW {}.{}",
            employerTpin, period, employees.size(), totalPayeNgwee / 100, totalPayeNgwee % 100);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("filename", filename);
        result.put("csvContent", csv.toString());
        result.put("recordCount", employees.size());
        result.put("totalPayeNgwee", totalPayeNgwee);
        result.put("totalPayeZmw", String.format("%.2f", totalPayeNgwee / 100.0));
        result.put("period", period);
        result.put("employerTpin", employerTpin);
        result.put("generatedAt", submissionDate);

        return result;
    }
}
