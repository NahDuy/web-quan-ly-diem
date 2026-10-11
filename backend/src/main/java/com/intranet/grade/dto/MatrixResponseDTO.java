package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatrixResponseDTO {
    private Integer classId;
    private String classCode;
    private String className;
    private String majorName;
    private String courseName;
    private Integer semester;

    // Grade Lock Status (Module 3)
    private Boolean isLocked;
    private ZonedDateTime lockedAt;
    private String lockedByUsername;
    private ZonedDateTime lockDeadline;
    private String autoLockReason;

    private List<SubjectColumnDTO> columns;
    private List<StudentRowDTO> rows;

    private Boolean isTeacherView;
    private String departmentFilterName;
    private List<Integer> assignedSubjectIds;
    private String userRole;
    private Boolean canEdit;
}
