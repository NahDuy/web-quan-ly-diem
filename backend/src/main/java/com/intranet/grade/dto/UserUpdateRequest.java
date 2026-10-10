package com.intranet.grade.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String roleCode;
    private Integer departmentId;
    private String newPassword;
}
