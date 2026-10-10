package com.intranet.grade.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentRequest {
    @NotBlank
    private String code;
    @NotBlank
    private String name;
    private String type; // PHONG_BAN, KHOA, BO_MON, DON_VI
}
