package com.intranet.grade.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignTeacherSubjectsRequest {
    private List<Integer> subjectIds;
}
