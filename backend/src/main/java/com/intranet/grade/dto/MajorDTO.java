package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MajorDTO {
    private Integer id;
    private String code;
    private String name;
    private Integer departmentId;
    private String departmentName;
    private Long classCount;
}