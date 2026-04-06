/**
 * DisbursePro — NAPSA Schedule 1 CSV Generator
 * Generates the monthly NAPSA contribution schedule for employer submission.
 * Format: NAPSA Schedule 1 specification — CSV with employee details and contributions.
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
public class NapsaScheduleGenerator {

    private static final long NAPSA_CEILING_NGWEE = 170_820L; // ZMW 1,708.20
    private static final double NAPSA_RATE = 0.05; // 5% employee, 5% employer

    private static final String[] NAPSA_HEADERS = {
        "SSN", "NRC", "Surname", "Other_Names", "Gross_Earnings_ZMW",
        "Employee_Contribution_ZMW", "Employer_Contribution_ZMW",
        "Total_Contribution_ZMW", "Period"
    };

    /**
     * Generate NAPSA Schedule 1 CSV.
     *
     * @param employerNumber NAPSA employer registration number
     * @param period contribution period (YYYY-MM)
     * @param employees list of employee records with SSN, NRC, name, gross
     * @return Map with CSV content, filename, totals
     */
    public Map<String, Object> generateSchedule1(String employerNumber, String period, List<Map<String, Object>> employees) {
        StringBuilder csv = new StringBuilder();
        csv.append(String.join(",", NAPSA_HEADERS)).append("\n");

        long totalEmployeeNgwee = 0;
        long totalEmployerNgwee = 0;

        for (Map<String, Object> emp : employees) {
            String ssn = (String) emp.getOrDefault("ssn", "");
            String nrc = (String) emp.getOrDefault("nrc", "");
            String surname = (String) emp.getOrDefault("surname", "");
            String otherNames = (String) emp.getOrDefault("otherNames", "");
            long grossNgwee = ((Number) emp.getOrDefault("grossNgwee", 0)).longValue();

            // NAPSA: 5% of gross, capped at ceiling
            long employeeContrib = Math.min((long) (grossNgwee * NAPSA_RATE), NAPSA_CEILING_NGWEE);
            long employerContrib = Math.min((long) (grossNgwee * NAPSA_RATE), NAPSA_CEILING_NGWEE);
            long total = employeeContrib + employerContrib;

            totalEmployeeNgwee += employeeContrib;
            totalEmployerNgwee += employerContrib;

            csv.append(String.format("%s,%s,%s,%s,%.2f,%.2f,%.2f,%.2f,%s\n",
                ssn, nrc, surname, otherNames,
                grossNgwee / 100.0, employeeContrib / 100.0,
                employerContrib / 100.0, total / 100.0, period));
        }

        String filename = String.format("NAPSA_SCHEDULE1_%s_%s.csv", employerNumber, period.replace("-", ""));

        log.info("Generated NAPSA Schedule 1: employer={}, period={}, employees={}, totalContrib=ZMW {}.{}",
            employerNumber, period, employees.size(),
            (totalEmployeeNgwee + totalEmployerNgwee) / 100,
            (totalEmployeeNgwee + totalEmployerNgwee) % 100);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("filename", filename);
        result.put("csvContent", csv.toString());
        result.put("recordCount", employees.size());
        result.put("totalEmployeeNgwee", totalEmployeeNgwee);
        result.put("totalEmployerNgwee", totalEmployerNgwee);
        result.put("totalContributionNgwee", totalEmployeeNgwee + totalEmployerNgwee);
        result.put("period", period);
        result.put("employerNumber", employerNumber);
        result.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));

        return result;
    }
}
