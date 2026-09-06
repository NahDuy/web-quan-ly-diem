package com.intranet.grade.controller;

import com.intranet.grade.service.ExcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/v1/classes")
@RequiredArgsConstructor
public class ExcelExportImportController {

    private final ExcelService excelService;

    @GetMapping("/{classId}/export-excel")
    public ResponseEntity<byte[]> exportExcel(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) throws IOException {

        byte[] excelBytes = excelService.exportClassMatrixToExcel(classId, semester);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=BangDiem_MaTran_Lop_" + classId + ".xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }

    @PostMapping("/{classId}/import-excel")
    public ResponseEntity<Map<String, Object>> importExcel(
            @PathVariable Integer classId,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "File tải lên không được rỗng"));
        }

        excelService.importClassMatrixFromExcel(classId, file);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Khởi tạo bảng điểm ma trận thành công từ file Excel"
        ));
    }
}
