package com.intranet.grade.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    private Integer id;
    private String code;
    private String name;
    private String type; // PHONG_BAN, KHOA, BO_MON, DON_VI
    private long userCount;
    private long subjectCount;
}
