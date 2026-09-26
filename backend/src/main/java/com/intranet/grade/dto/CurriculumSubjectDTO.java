package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurriculumSubjectDTO {
    private Integer id;
    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Integer hours;
    private Integer semester;
    private String type; // MON_HOC_PHAN, MON_THI_TOT_NGHIEP
    private String examFormat; // Thực hành bắn đạn thật, Vấn đáp, Lý thuyết, Thao trường
    private Double weight; // 1.0, 2.0
    private String departmentName;
    private Boolean isCompulsory;
}
