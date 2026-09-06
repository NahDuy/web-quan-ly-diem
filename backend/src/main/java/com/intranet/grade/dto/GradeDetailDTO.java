package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GradeDetailDTO {
    private Long gradeId;
    private BigDecimal score;
    private String status;
    private ZonedDateTime updatedAt;
}
