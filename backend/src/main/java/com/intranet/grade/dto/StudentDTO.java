package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private String studentCode;
    private String fullName;
    private String dob;
    private String pob;
    private String gender;
    private Integer classId;
    private String className;
    private String classCode;
    private Integer academicYear;
    private String rank;
    private String status;
}
