package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdmissionsPreviewResponse {
    private String fileName;
    private Integer totalSections;
    private Integer totalStudents;
    private Integer academicYear;
    private String defaultTargetType;
    private List<ParsedSectionDTO> sections;
}