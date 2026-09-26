package com.intranet.grade.controller;

import com.intranet.grade.dto.BulkUpdateMatrixRequest;
import com.intranet.grade.dto.MatrixResponseDTO;
import com.intranet.grade.service.GradeMatrixService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/classes")
@RequiredArgsConstructor
public class ClassMatrixController {

    private final GradeMatrixService gradeMatrixService;
    private final com.intranet.grade.repository.ClassRepository classRepository;

    @GetMapping
    public ResponseEntity<List<com.intranet.grade.dto.ClassSummaryDTO>> getAllClasses() {
        List<com.intranet.grade.dto.ClassSummaryDTO> list = classRepository.findAll().stream()
                .map(c -> com.intranet.grade.dto.ClassSummaryDTO.builder()
                        .id(c.getId())
                        .code(c.getCode())
                        .name(c.getName())
                        .majorCode(c.getMajor() != null ? c.getMajor().getCode() : null)
                        .majorName(c.getMajor() != null ? c.getMajor().getName() : null)
                        .courseCode(c.getCourse() != null ? c.getCourse().getCode() : null)
                        .courseName(c.getCourse() != null ? c.getCourse().getName() : null)
                        .academicYear(c.getCourse() != null ? c.getCourse().getStartYear() : null)
                        .build())
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{classId}/matrix")
    public ResponseEntity<MatrixResponseDTO> getClassMatrix(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {
        MatrixResponseDTO response = gradeMatrixService.getClassMatrix(classId, semester);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{classId}/matrix/bulk-update")
    public ResponseEntity<Map<String, Object>> bulkUpdateMatrix(
            @PathVariable Integer classId,
            @Valid @RequestBody BulkUpdateMatrixRequest request,
            HttpServletRequest httpServletRequest) {
        String clientIp = httpServletRequest.getRemoteAddr();
        gradeMatrixService.bulkUpdateMatrix(classId, request, clientIp);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật bảng điểm ma trận và lưu Audit Log thành công."
        ));
    }

    @PostMapping("/{classId}/add-subject")
    public ResponseEntity<Map<String, Object>> addSubjectToClass(
            @PathVariable Integer classId,
            @RequestParam Integer subjectId,
            @RequestParam(required = false, defaultValue = "1") Integer semester,
            @RequestParam(required = false, defaultValue = "true") Boolean isExtra) {

        gradeMatrixService.addSubjectToClass(classId, semester, subjectId, isExtra);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã gán thêm cột môn học linh hoạt vào ma trận điểm của lớp thành công."
        ));
    }

    @PostMapping("/{classId}/lock")
    public ResponseEntity<Map<String, Object>> lockGradeMatrix(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {

        gradeMatrixService.lockMatrix(classId, semester);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã khóa bảng điểm của lớp thành công."
        ));
    }

    @PostMapping("/{classId}/unlock")
    public ResponseEntity<Map<String, Object>> unlockGradeMatrix(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {

        gradeMatrixService.unlockMatrix(classId, semester);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã mở khóa bảng điểm của lớp thành công."
        ));
    }
}
