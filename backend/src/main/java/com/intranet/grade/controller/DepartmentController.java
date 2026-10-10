package com.intranet.grade.controller;

import com.intranet.grade.dto.*;
import com.intranet.grade.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PostMapping
    public ResponseEntity<DepartmentDTO> createDepartment(@Valid @RequestBody DepartmentRequest req) {
        return ResponseEntity.ok(departmentService.createDepartment(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDTO> updateDepartment(@PathVariable Integer id, @Valid @RequestBody DepartmentRequest req) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDepartment(@PathVariable Integer id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa đơn vị/khoa thành công!"));
    }

    @GetMapping("/{id}/subjects")
    public ResponseEntity<List<SubjectSimpleDTO>> getSubjectsByDepartment(@PathVariable Integer id) {
        return ResponseEntity.ok(departmentService.getSubjectsByDepartment(id));
    }

    @PostMapping("/{deptId}/subjects/{subjectId}")
    public ResponseEntity<Map<String, Object>> assignSubjectToDepartment(@PathVariable Integer deptId, @PathVariable Integer subjectId) {
        departmentService.assignSubjectToDepartment(deptId, subjectId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã gán môn học vào khoa thành công!"));
    }

    @GetMapping("/{id}/teachers")
    public ResponseEntity<List<UserManagementDTO>> getTeachersByDepartment(@PathVariable Integer id) {
        return ResponseEntity.ok(departmentService.getTeachersByDepartment(id));
    }

    @PostMapping("/teachers/{teacherId}/assign-subjects")
    public ResponseEntity<Map<String, Object>> assignSubjectsToTeacher(
            @PathVariable Long teacherId,
            @RequestBody AssignTeacherSubjectsRequest req) {
        departmentService.assignSubjectsToTeacher(teacherId, req.getSubjectIds());
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã phân công môn giảng dạy cho giáo viên thành công!"));
    }

    @GetMapping("/teachers/{teacherId}/subjects")
    public ResponseEntity<List<Integer>> getAssignedSubjectIds(@PathVariable Long teacherId) {
        return ResponseEntity.ok(departmentService.getAssignedSubjectIdsForTeacher(teacherId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserManagementDTO>> getAllUsers() {
        return ResponseEntity.ok(departmentService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserManagementDTO> createUser(@Valid @RequestBody UserCreateRequest req) {
        return ResponseEntity.ok(departmentService.createUser(req));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserManagementDTO> updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequest req) {
        return ResponseEntity.ok(departmentService.updateUser(userId, req));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        departmentService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa tài khoản thành công!"));
    }
}
