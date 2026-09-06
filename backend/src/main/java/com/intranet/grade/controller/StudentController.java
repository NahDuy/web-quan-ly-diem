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

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents(@RequestParam(required = false) Integer classId) {
        return ResponseEntity.ok(studentService.getAllStudents(classId));
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
