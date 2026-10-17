package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurriculumSubjectRequest {
    private Integer curriculumId;
    private String majorCode;
    private String courseCode;
    private String targetGroup;
    private Integer subjectId; // Id của môn học (nếu chọn từ danh mục có sẵn)
    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Integer semester;
    private Integer departmentId;
    private String type; // MON_HOC_PHAN, MON_THI_TOT_NGHIEP
    private String examFormat;
    private Double weight;
    private Boolean isCompulsory;
}
