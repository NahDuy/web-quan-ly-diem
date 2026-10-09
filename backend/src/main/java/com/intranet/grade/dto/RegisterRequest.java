package com.intranet.grade.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    private String email;

    private String role; // e.g. "ROLE_GIANGVIEN", "ROLE_BOMON", "ROLE_BGH", "ROLE_SINHVIEN"

    private Integer departmentId;
}
