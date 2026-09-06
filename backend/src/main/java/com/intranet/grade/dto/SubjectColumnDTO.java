package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubjectColumnDTO {
    private Integer subjectId;
    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Integer departmentId;
    private String departmentName;
}
