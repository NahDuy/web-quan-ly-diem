package com.intranet.grade.controller;

import com.intranet.grade.dto.CurriculumProgressDTO;
import com.intranet.grade.service.CurriculumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/curriculums")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumService curriculumService;
    private final com.intranet.grade.service.ExcelService excelService;

    @GetMapping
    public ResponseEntity<java.util.List<com.intranet.grade.dto.CurriculumDTO>> getAllCurriculums(
            @RequestParam(required = false) String majorCode,
            @RequestParam(required = false) String targetGroup) {
        return ResponseEntity.ok(curriculumService.getAllCurriculums(majorCode, targetGroup));
    }

    @GetMapping("/export-template")
    public ResponseEntity<byte[]> exportCurriculumTemplate(
            @RequestParam(required = false, defaultValue = "TSBB") String majorCode,
            @RequestParam(required = false, defaultValue = "SQDB") String targetGroup) throws java.io.IOException {

        byte[] bytes = excelService.exportCurriculumTemplate(majorCode, targetGroup);
        String filename = "Khung_ChuongTrinh_Thi_" + majorCode + "_" + targetGroup + ".xlsx";

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .body(bytes);
    }

    @PostMapping("/import-excel")
    public ResponseEntity<?> importCurriculumExcel(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            java.util.Map<String, Object> result = excelService.importCurriculumFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "success", false,
                    "message", "Lỗi nạp file Lộ trình đào tạo: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/progress/class/{classId}")
    public ResponseEntity<CurriculumProgressDTO> getClassCurriculumProgress(@PathVariable Integer classId) {
        CurriculumProgressDTO progress = curriculumService.getClassCurriculumProgress(classId);
        return ResponseEntity.ok(progress);
    }
}
