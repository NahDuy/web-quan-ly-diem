package com.intranet.grade.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EvaluationUpdateItem {
    private Long studentId;
    private String conductGrade; // TOT, KHA, TRUNG_BINH, KEM

    @DecimalMin(value = "0.0", message = "Điểm thi Chính trị không được nhỏ hơn 0")
    @DecimalMax(value = "10.0", message = "Điểm thi Chính trị không được lớn hơn 10")
    private BigDecimal scorePolitical; // Môn 1: Thi Chính trị

    @DecimalMin(value = "0.0", message = "Điểm thi Quân sự chung không được nhỏ hơn 0")
    @DecimalMax(value = "10.0", message = "Điểm thi Quân sự chung không được lớn hơn 10")
    private BigDecimal scoreMilitary; // Môn 2: Thi Quân sự chung

    @DecimalMin(value = "0.0", message = "Điểm thi Chuyên ngành không được nhỏ hơn 0")
    @DecimalMax(value = "10.0", message = "Điểm thi Chuyên ngành không được lớn hơn 10")
    private BigDecimal scoreSpecialty; // Môn 3: Thi Chuyên ngành

    @DecimalMin(value = "0.0", message = "Điểm tốt nghiệp không được nhỏ hơn 0")
    @DecimalMax(value = "10.0", message = "Điểm tốt nghiệp không được lớn hơn 10")
    private BigDecimal graduationExamScore; // Điểm TN (TBC 3 môn)
}
