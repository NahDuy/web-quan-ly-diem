package com.intranet.grade.dto;

import lombok.*;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemHealthDTO {
    private String status;
    private String uptime;
    private long uptimeSeconds;
    private long jvmHeapUsedMb;
    private long jvmHeapTotalMb;
    private long jvmHeapMaxMb;
    private double jvmHeapUsagePercent;
    private int availableProcessors;
    private String javaVersion;
    private String osName;

    // Database statistics
    private String dbStatus;
    private int dbActiveConnections;
    private int dbIdleConnections;
    private int dbTotalConnections;

    // Entity counts
    private long totalStudents;
    private long totalGrades;
    private long totalClasses;
    private long totalSubjects;
    private long totalDepartments;
    private long totalUsers;
    private long totalAuditLogs;

    // Data integrity indicators
    private Map<String, Object> integrityOverview;
}
