package com.intranet.grade.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class BulkUpdateMatrixRequest {
    private Integer semester;

    @NotBlank(message = "Lý do thay đổi điểm là bắt buộc để ghi Audit Log")
    private String reason;

    private List<GradeUpdateItem> gradeUpdates;
    private List<EvaluationUpdateItem> evaluationUpdates;
}
