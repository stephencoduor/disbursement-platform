/**
 * DisbursePro — NHIMA Return Generator
 * Generates the monthly NHIMA (National Health Insurance Management Authority)
 * contribution return for employer submission.
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
public class NhimaReturnGenerator {

    private static final double NHIMA_EMPLOYEE_RATE = 0.01; // 1%
    private static final double NHIMA_EMPLOYER_RATE = 0.01; // 1%

    /**
     * Generate NHIMA contribution return.
     */
    public Map<String, Object> generateReturn(String employerCode, String period, List<Map<String, Object>> employees) {
        StringBuilder csv = new StringBuilder();
        csv.append("NRC,Employee_Name,Gross_Earnings_ZMW,Employee_NHIMA_ZMW,Employer_NHIMA_ZMW,Total_ZMW,Period\n");

        long totalEmployeeNgwee = 0;
        long totalEmployerNgwee = 0;

        for (Map<String, Object> emp : employees) {
            String nrc = (String) emp.getOrDefault("nrc", "");
            String name = (String) emp.getOrDefault("name", "");
            long grossNgwee = ((Number) emp.getOrDefault("grossNgwee", 0)).longValue();

            long empContrib = (long) (grossNgwee * NHIMA_EMPLOYEE_RATE);
            long erContrib = (long) (grossNgwee * NHIMA_EMPLOYER_RATE);
            totalEmployeeNgwee += empContrib;
            totalEmployerNgwee += erContrib;

            csv.append(String.format("%s,%s,%.2f,%.2f,%.2f,%.2f,%s\n",
                nrc, name, grossNgwee / 100.0,
                empContrib / 100.0, erContrib / 100.0,
                (empContrib + erContrib) / 100.0, period));
        }

        String filename = String.format("NHIMA_RETURN_%s_%s.csv", employerCode, period.replace("-", ""));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("filename", filename);
        result.put("csvContent", csv.toString());
        result.put("recordCount", employees.size());
        result.put("totalEmployeeNgwee", totalEmployeeNgwee);
        result.put("totalEmployerNgwee", totalEmployerNgwee);
        result.put("period", period);
        result.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));

        return result;
    }
}
