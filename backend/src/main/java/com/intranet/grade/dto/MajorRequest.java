package com.intranet.grade.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MajorRequest {
    @NotBlank(message = "Mã quy ước chuyên ngành là bắt buộc (ví dụ: TSBB, COI, DKZ, PK127)")
    private String code;

    @NotBlank(message = "Tên chuyên ngành là bắt buộc (ví dụ: Trinh sát Bộ binh)")
    private String name;

    private Integer departmentId;
}