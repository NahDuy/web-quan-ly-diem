package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuditLogDTO {
    private Long id;
    private Long gradeId;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private Integer subjectId;
    private String subjectCode;
    private String subjectName;
    private Integer classId;
    private String classCode;
    private BigDecimal oldValue;
    private BigDecimal newValue;
    private String reason;
    private Long modifiedBy;
    private String modifiedByUsername;
    private String modifiedByRole;
    private ZonedDateTime modifiedAt;
    private String ipAddress;
}
