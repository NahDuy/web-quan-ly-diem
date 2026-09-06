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
public class CurriculumProgressDTO {
    private Integer curriculumId;
    private String curriculumName;
    private String majorName;
    private String courseName;
    private Integer totalCredits;
    private Integer completedCredits;
    private Double completionPercentage;

    private List<SemesterProgressDTO> semesterProgressList;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SemesterProgressDTO {
        private Integer semester;
        private Integer totalSubjects;
        private Integer completedSubjects;
        private Integer totalCredits;
        private Integer earnedCredits;
    }
}
