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
public class ParsedSectionDTO {
    private String rawTitle;
    private String rawMajor;
    private String khoaName;
    private String targetType; // SQDB, TDT, KDT, NVKT
    private String targetName; // Sĩ quan Dự bị, Tiểu đội trưởng, Khẩu đội trưởng...
    private String majorCode; // TSBB, COI, DKZ, PK127, BB...
    private String majorName;
    private String classCode; // SQDB2026-TSBB1, TDT2026-BB1, K225-TSBB...
    private String className;
    private Integer studentCount;
    private String codeRange;
    private List<ParsedStudentDTO> students;
}