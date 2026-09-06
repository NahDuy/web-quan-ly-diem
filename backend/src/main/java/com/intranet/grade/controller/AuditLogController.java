package com.intranet.grade.controller;

import com.intranet.grade.dto.AuditLogDTO;
import com.intranet.grade.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/grades")
    public ResponseEntity<Page<AuditLogDTO>> getAuditLogs(
            @RequestParam(required = false) Integer classId,
            @RequestParam(required = false) Integer subjectId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<AuditLogDTO> logs = auditLogService.getAuditLogs(classId, subjectId, studentId, page, size);
        return ResponseEntity.ok(logs);
    }
}
