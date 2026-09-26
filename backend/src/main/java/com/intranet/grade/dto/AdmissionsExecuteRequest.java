package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdmissionsExecuteRequest {
    private Integer academicYear;
    private List<ParsedSectionDTO> sections;
}