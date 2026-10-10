package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClassSummaryDTO {
    private Integer id;
    private String code;
    private String name;
    private String majorCode;
    private String majorName;
    private String courseCode;
    private String courseName;
    private Integer academicYear;
    private Long totalStudents;
}
