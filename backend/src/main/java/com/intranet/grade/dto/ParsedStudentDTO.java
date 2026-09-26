package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ParsedStudentDTO {
    private Integer stt;
    private String studentCode;
    private String fullName;
    private String dob;
    private String pob;
    private String gender;
    private String ethnic;
    private String unit;
}