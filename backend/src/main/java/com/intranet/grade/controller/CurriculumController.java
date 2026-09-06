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

    @GetMapping("/progress/class/{classId}")
    public ResponseEntity<CurriculumProgressDTO> getClassCurriculumProgress(@PathVariable Integer classId) {
        CurriculumProgressDTO progress = curriculumService.getClassCurriculumProgress(classId);
        return ResponseEntity.ok(progress);
    }
}
