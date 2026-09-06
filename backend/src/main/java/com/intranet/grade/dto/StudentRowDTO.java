package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRowDTO {
    private Integer stt;
    private Long studentId;
    private String studentCode; // Số vào sổ / MSSV
    private String fullName;
    private LocalDate dob; // Ngày sinh
    private String pob; // Quê quán
    private String gender;
    
    // Map subjectId -> GradeDetailDTO
    private Map<Integer, GradeDetailDTO> grades;

    private BigDecimal tbcScore; // Trung bình cộng toàn khóa (TB)
    private String conductGrade; // Phân loại rèn luyện (XUAT_SAC, TOT, KHA, TRUNG_BINH, YEU)
    private Boolean isEligibleForGradExam; // ĐK Rèn luyện >= Khá AND TB >= 6.5
    private Boolean isEligibleForGraduation; // Trạng thái xét TN
    private String gradExamEligibilityText; // "Đủ điều kiện" / "Không đủ ĐK"
    
    private BigDecimal graduationExamScore; // Điểm Thi TN
    private BigDecimal finalGraduationScore; // Điểm TN = (TB*1 + TN*2)/3
    private String graduationClassification; // XUAT_SAC, GIOL, KHA, TRUNG_BINH, KHONG_DAT
}
