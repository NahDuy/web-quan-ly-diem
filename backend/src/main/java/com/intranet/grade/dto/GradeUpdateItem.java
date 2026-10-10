package com.intranet.grade.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GradeUpdateItem {
    private Long studentId;
    private Integer subjectId;

    @DecimalMin(value = "0.0", message = "Điểm môn học không được nhỏ hơn 0")
    @DecimalMax(value = "10.0", message = "Điểm môn học không được lớn hơn 10")
    private BigDecimal score;
}
