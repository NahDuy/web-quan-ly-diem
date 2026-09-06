package com.intranet.grade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateStudentRequest {
    @NotBlank(message = "Số hiệu học viên (studentCode) là bắt buộc")
    private String studentCode;

    @NotBlank(message = "Họ và tên học viên là bắt buộc")
    private String fullName;

    private String dob;
    private String pob;
    private String gender;
    private String rank;
    
    @NotNull(message = "Lớp học (classId) là bắt buộc")
    private Integer classId;
}
