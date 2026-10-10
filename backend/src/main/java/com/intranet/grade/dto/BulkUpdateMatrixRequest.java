package com.intranet.grade.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class BulkUpdateMatrixRequest {
    private Integer semester;

    @NotBlank(message = "Lý do thay đổi điểm là bắt buộc để ghi Audit Log")
    private String reason;

    @Valid
    private List<GradeUpdateItem> gradeUpdates;

    @Valid
    private List<EvaluationUpdateItem> evaluationUpdates;
}
