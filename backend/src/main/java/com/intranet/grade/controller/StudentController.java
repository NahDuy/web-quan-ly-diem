package com.intranet.grade.controller;

import com.intranet.grade.dto.CreateStudentRequest;
import com.intranet.grade.dto.StudentDTO;
import com.intranet.grade.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final com.intranet.grade.service.ExcelService excelService;

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents(
            @RequestParam(required = false) Integer classId,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(studentService.getAllStudents(classId, year));
    }

    @GetMapping("/export-excel")
    public ResponseEntity<byte[]> exportStudentsExcel(@RequestParam(required = false) Integer classId) throws java.io.IOException {
        byte[] bytes = excelService.exportStudentsToExcel(classId);
        String filename = classId != null ? "DanhSach_HocVien_Lop_" + classId + ".xlsx" : "DanhSach_HocVien_ToanBo.xlsx";
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .body(bytes);
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        try {
            StudentDTO dto = studentService.createStudent(request);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Lỗi lưu học viên: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody CreateStudentRequest request) {
        try {
            StudentDTO dto = studentService.updateStudent(id, request);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Lỗi cập nhật học viên: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã xóa học viên thành công khỏi hệ thống."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi xóa học viên: " + e.getMessage()
            ));
        }
    }
}
