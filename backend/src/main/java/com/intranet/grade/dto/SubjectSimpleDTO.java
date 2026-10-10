package com.intranet.grade.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectSimpleDTO {
    private Integer id;
    private String code;
    private String name;
    private Integer credits;
    private Integer departmentId;
    private String departmentName;
}
