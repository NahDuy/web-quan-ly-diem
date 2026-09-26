package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurriculumDTO {
    private Integer id;
    private String name;
    private Integer majorId;
    private String majorCode;
    private String majorName;
    private String targetGroup; // SQDB, KHAU_DOI_TRUONG, TIEU_DOI_TRUONG
    private String targetGroupName; // Sĩ quan Dự bị, Khẩu đội trưởng, Tiểu đội trưởng
    private Integer courseId;
    private String courseCode;
    private String courseName;
    private Integer academicYear;
    private Integer totalCredits;
    private Integer totalHours;
    @Builder.Default
    private List<CurriculumSubjectDTO> subjects = new ArrayList<>();
}
