package com.intranet.grade.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GradeUpdateItem {
    private Long studentId;
    private Integer subjectId;
    private BigDecimal score;
}
