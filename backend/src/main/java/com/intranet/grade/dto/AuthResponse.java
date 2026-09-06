package com.intranet.grade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String fullName;
    private String role;
    private Integer departmentId;
    private String departmentName;
}
