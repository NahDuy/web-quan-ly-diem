package com.intranet.grade.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String roleCode;
    private String roleName;
    private Integer departmentId;
    private String departmentName;
    private String departmentType;
    private Boolean isActive;
    private List<SubjectSimpleDTO> assignedSubjects;
}
