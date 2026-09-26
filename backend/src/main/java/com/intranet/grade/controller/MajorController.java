package com.intranet.grade.controller;

import com.intranet.grade.dto.MajorDTO;
import com.intranet.grade.dto.MajorRequest;
import com.intranet.grade.entity.Department;
import com.intranet.grade.repository.DepartmentRepository;
import com.intranet.grade.service.MajorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/majors")
@RequiredArgsConstructor
public class MajorController {

    private final MajorService majorService;
    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<MajorDTO>> getAllMajors() {
        return ResponseEntity.ok(majorService.getAllMajors());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<MajorDTO> createMajor(@Valid @RequestBody MajorRequest req) {
        return ResponseEntity.ok(majorService.createMajor(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MajorDTO> updateMajor(@PathVariable Integer id, @Valid @RequestBody MajorRequest req) {
        return ResponseEntity.ok(majorService.updateMajor(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMajor(@PathVariable Integer id) {
        majorService.deleteMajor(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã xóa chuyên ngành thành công khỏi hệ thống."
        ));
    }
}