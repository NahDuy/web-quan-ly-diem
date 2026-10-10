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
    private final com.intranet.grade.service.ClassService classService;

    @GetMapping
    public ResponseEntity<List<com.intranet.grade.dto.ClassSummaryDTO>> getAllClasses() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllClasses() {
        int count = classService.deleteAllClasses();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã xóa toàn bộ " + count + " lớp học và toàn bộ học viên thành công!",
                "deletedCount", count
        ));
    }

    @DeleteMapping("/{classId}")
    public ResponseEntity<?> deleteClass(@PathVariable Integer classId) {
        classService.deleteClass(classId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã xóa lớp học thành công!"
        ));
    }

    @GetMapping("/{classId}/matrix")
    public ResponseEntity<MatrixResponseDTO> getClassMatrix(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {
        MatrixResponseDTO response = gradeMatrixService.getClassMatrix(classId, semester);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{classId}/init-from-curriculum")
    public ResponseEntity<Map<String, Object>> initFromCurriculum(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {
        var subjects = gradeMatrixService.initializeClassMatrixFromCurriculum(classId, semester);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã khởi tạo thành công " + subjects.size() + " môn học theo Lộ trình đào tạo của chuyên ngành!",
                "totalSubjects", subjects.size()
        ));
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

    @GetMapping("/available-subjects")
    public ResponseEntity<List<com.intranet.grade.entity.Subject>> getAvailableSubjects() {
        return ResponseEntity.ok(gradeMatrixService.getAllSubjects());
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

    @PostMapping("/{classId}/create-and-add-subject")
    public ResponseEntity<Map<String, Object>> createAndAddSubject(
            @PathVariable Integer classId,
            @RequestParam String subjectCode,
            @RequestParam String subjectName,
            @RequestParam(required = false, defaultValue = "3") Integer credits,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {

        com.intranet.grade.entity.Subject subject = gradeMatrixService.createAndAddSubject(classId, semester, subjectCode, subjectName, credits);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã thêm môn học " + subject.getName() + " (" + subject.getCode() + ") vào bảng điểm của lớp thành công.",
                "subject", subject
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

    @PostMapping("/{classId}/replace-subject")
    public ResponseEntity<Map<String, Object>> replaceSubjectInClass(
            @PathVariable Integer classId,
            @RequestParam Integer oldSubjectId,
            @RequestParam Integer newSubjectId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {

        gradeMatrixService.replaceSubjectInClass(classId, semester, oldSubjectId, newSubjectId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã đổi môn học cho riêng lớp này thành công mà không ảnh hưởng đến chương trình đào tạo chung!"
        ));
    }

    @DeleteMapping("/{classId}/remove-subject/{subjectId}")
    public ResponseEntity<Map<String, Object>> removeSubjectFromClass(
            @PathVariable Integer classId,
            @PathVariable Integer subjectId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) {

        gradeMatrixService.removeSubjectFromClass(classId, semester, subjectId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã xóa môn học khỏi bảng điểm của lớp thành công!"
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

    @PutMapping("/subjects/{subjectId}")
    public ResponseEntity<Map<String, Object>> updateSubject(
            @PathVariable Integer subjectId,
            @RequestParam(required = false) String subjectCode,
            @RequestParam(required = false) String subjectName,
            @RequestParam(required = false) Integer credits) {

        gradeMatrixService.updateSubject(subjectId, subjectCode, subjectName, credits);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã cập nhật thông tin môn học thành công!"
        ));
    }
}
