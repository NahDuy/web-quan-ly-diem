package com.intranet.grade.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EvaluationUpdateItem {
    private Long studentId;
    private String conductGrade; // TOT, KHA, TRUNG_BINH, KEM
    private BigDecimal scorePolitical; // Môn 1: Thi Chính trị
    private BigDecimal scoreMilitary; // Môn 2: Thi Quân sự chung
    private BigDecimal scoreSpecialty; // Môn 3: Thi Chuyên ngành
    private BigDecimal graduationExamScore; // Điểm TN (TBC 3 môn)
}
