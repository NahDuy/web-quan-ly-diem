package com.intranet.grade.controller;

import com.intranet.grade.entity.ClassEntity;
import com.intranet.grade.repository.ClassRepository;
import com.intranet.grade.service.ExcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/classes")
@RequiredArgsConstructor
public class ExcelExportImportController {

    private final ExcelService excelService;
    private final ClassRepository classRepository;

    private String getSafeClassIdentifier(Integer classId) {
        if (classId == null) return "Lop_Chung";
        return classRepository.findById(classId)
                .map(ClassEntity::getCode)
                .filter(code -> !code.trim().isEmpty())
                .orElse("Lop_" + classId);
    }

    @GetMapping("/{classId}/export-excel")
    public ResponseEntity<byte[]> exportExcel(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester,
            @RequestParam(required = false, defaultValue = "matrix") String type) throws IOException {

        if ("hoc_phan".equalsIgnoreCase(type) || "hocphan".equalsIgnoreCase(type)) {
            return exportHocPhan(classId, semester);
        } else if ("tot_nghiep".equalsIgnoreCase(type) || "totnghiep".equalsIgnoreCase(type)) {
            return exportTotNghiep(classId, semester);
        }

        byte[] excelBytes = excelService.exportClassMatrixToExcel(classId, semester);
        String classIdent = getSafeClassIdentifier(classId);
        String filename = "Mau_Nhap_Diem_" + classIdent + "_HK" + semester + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }

    @GetMapping("/{classId}/export-hoc-phan")
    public ResponseEntity<byte[]> exportHocPhan(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) throws IOException {

        byte[] excelBytes = excelService.exportKetQuaHocPhanExcel(classId, semester);
        String classIdent = getSafeClassIdentifier(classId);
        String filename = "KetQuaHocPhan_" + classIdent + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }

    @GetMapping("/{classId}/export-tot-nghiep")
    public ResponseEntity<byte[]> exportTotNghiep(
            @PathVariable Integer classId,
            @RequestParam(required = false, defaultValue = "1") Integer semester) throws IOException {

        byte[] excelBytes = excelService.exportKetQuaTotNghiepExcel(classId, semester);
        String classIdent = getSafeClassIdentifier(classId);
        String filename = "KetQuaTotNghiep_" + classIdent + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }

    @GetMapping("/export-all-classes-hoc-phan")
    public ResponseEntity<byte[]> exportAllClassesHocPhan(
            @RequestParam(required = false, defaultValue = "1") Integer semester) throws IOException {

        byte[] excelBytes = excelService.exportAllClassesHocPhanExcel(semester);
        String filename = "SoKetQuaHocPhan_ToanBoCacLop_2026.xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }

    @GetMapping("/export-all-classes-tot-nghiep")
    public ResponseEntity<byte[]> exportAllClassesTotNghiep(
            @RequestParam(required = false, defaultValue = "1") Integer semester) throws IOException {

        byte[] excelBytes = excelService.exportAllClassesTotNghiepExcel(semester);
        String filename = "SoKetQuaTotNghiep_ToanBoCacLop_2026.xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }

    @GetMapping("/export-tong-hop-xet-dieu-kien")
    public ResponseEntity<byte[]> exportTongHopXetDieuKien(
            @RequestParam(required = false, defaultValue = "1") Integer semester,
            @RequestParam(required = false) List<Integer> classIds) throws IOException {

        byte[] excelBytes = excelService.exportTongHopXetDieuKien(semester, classIds);
        String filename = (classIds != null && !classIds.isEmpty())
                ? "TH_XetDieuKienDuThi_TuyChonLop_2026.xlsx"
                : "TH_XetDieuKienDuThi_ToanTruong_2026.xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
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
