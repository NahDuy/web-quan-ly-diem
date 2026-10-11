package com.intranet.grade.controller;

import com.intranet.grade.dto.SystemHealthDTO;
import com.intranet.grade.service.SystemAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class SystemAdminController {

    private final SystemAdminService adminService;

    @GetMapping("/health")
    public ResponseEntity<SystemHealthDTO> getSystemHealth() {
        return ResponseEntity.ok(adminService.getSystemHealth());
    }

    @PostMapping("/fix-sequences")
    public ResponseEntity<Map<String, Object>> fixSequences() {
        return ResponseEntity.ok(adminService.fixPostgresSequences());
    }

    @PostMapping("/recalculate-all-grades")
    public ResponseEntity<Map<String, Object>> recalculateAllGrades() {
        return ResponseEntity.ok(adminService.recalculateAllGrades());
    }

    @PostMapping("/emergency-unlock-all")
    public ResponseEntity<Map<String, Object>> emergencyUnlockAll() {
        return ResponseEntity.ok(adminService.emergencyUnlockAllClasses());
    }

    @PostMapping("/optimize-database")
    public ResponseEntity<Map<String, Object>> optimizeDatabase() {
        return ResponseEntity.ok(adminService.optimizeDatabase());
    }

    @GetMapping("/integrity-report")
    public ResponseEntity<Map<String, Object>> getIntegrityReport() {
        return ResponseEntity.ok(adminService.getDataIntegrityReport());
    }
}
