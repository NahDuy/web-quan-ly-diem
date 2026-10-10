package com.intranet.grade.controller;

import com.intranet.grade.dto.AdmissionsExecuteRequest;
import com.intranet.grade.dto.AdmissionsPreviewResponse;
import com.intranet.grade.service.AdmissionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admissions")
@RequiredArgsConstructor
public class AdmissionsController {

    private final AdmissionsService admissionsService;

    @GetMapping("/training-targets")
    public ResponseEntity<List<Map<String, String>>> getTrainingTargets() {
        return ResponseEntity.ok(List.of(
                Map.of("code", "AUTO", "name", "Tự động nhận diện từ File (SQDB Hạng 1, Sinh viên, Xuất ngũ...)", "classPrefix", "AUTO", "studentPrefix", "AUTO"),
                Map.of("code", "SQDB_H1", "name", "SQDB (Hạng 1) - Sĩ quan Dự bị từ HSQ dự bị hạng 1", "classPrefix", "SQDB(H1)", "studentPrefix", "26H1-"),
                Map.of("code", "SQDB_SV", "name", "SQDB (Sinh viên) - Sĩ quan Dự bị từ sinh viên TNĐH", "classPrefix", "SQDB(SV)", "studentPrefix", "26SV-"),
                Map.of("code", "SQDB_XN", "name", "SQDB (Xuất ngũ) - Sĩ quan Dự bị từ HSQ xuất ngũ", "classPrefix", "SQDB(XN)", "studentPrefix", "26XN-"),
                Map.of("code", "SQDB", "name", "Sĩ quan Dự bị (SQDB - Chung)", "classPrefix", "SQDB", "studentPrefix", "26"),
                Map.of("code", "TDT", "name", "Tiểu đội trưởng (TĐT)", "classPrefix", "TDT", "studentPrefix", "26TDT-"),
                Map.of("code", "KDT", "name", "Khẩu đội trưởng (KĐT)", "classPrefix", "KDT", "studentPrefix", "26KDT-"),
                Map.of("code", "NVKT", "name", "Nhân viên Chuyên môn Kỹ thuật", "classPrefix", "NVKT", "studentPrefix", "26NVKT-"),
                Map.of("code", "HSQ", "name", "Hạ sĩ quan Chỉ huy", "classPrefix", "HSQ", "studentPrefix", "26HSQ-")
        ));
    }

    @PostMapping("/preview")
    public ResponseEntity<AdmissionsPreviewResponse> previewAdmissionsFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetType", required = false) String targetType,
            @RequestParam(value = "academicYear", required = false, defaultValue = "2026") Integer academicYear,
            @RequestParam(value = "classNamingMode", required = false, defaultValue = "THEO_NAM") String classNamingMode) throws Exception {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File tải lên không được để trống!");
        }

        AdmissionsPreviewResponse response = admissionsService.previewAdmissionsFile(file, targetType, academicYear, classNamingMode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeAdmissionsImport(@RequestBody AdmissionsExecuteRequest req) {
        if (req.getSections() == null || req.getSections().isEmpty()) {
            throw new IllegalArgumentException("Không có dữ liệu khối học viên nào để import!");
        }
        Map<String, Object> result = admissionsService.executeAdmissionsImport(req);
        return ResponseEntity.ok(result);
    }
}