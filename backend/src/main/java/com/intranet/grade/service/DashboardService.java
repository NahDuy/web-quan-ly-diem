package com.intranet.grade.service;

import com.intranet.grade.entity.Student;
import com.intranet.grade.entity.StudentEvaluation;
import com.intranet.grade.repository.StudentEvaluationRepository;
import com.intranet.grade.repository.StudentRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final StudentEvaluationRepository evaluationRepository;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DashboardSummaryDTO {
        private long totalStudents;
        private long eligibleStudentsCount;
        private long ineligibleStudentsCount;
        private double passRatePercentage;
        private Map<String, Long> classificationCounts;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDTO getDashboardSummary() {
        long totalStudents = studentRepository.count();
        List<StudentEvaluation> evaluations = evaluationRepository.findAll();

        long eligibleCount = evaluations.stream()
                .filter(e -> e.getFinalGraduationScore() != null && e.getFinalGraduationScore().doubleValue() >= 5.0)
                .count();

        long ineligibleCount = Math.max(0, totalStudents - eligibleCount);
        double passRate = totalStudents > 0 ? (double) eligibleCount / totalStudents * 100.0 : 0.0;

        long xuatSac = evaluations.stream().filter(e -> "XUAT_SAC".equalsIgnoreCase(e.getGraduationClassification())).count();
        long gioi = evaluations.stream().filter(e -> "GIOL".equalsIgnoreCase(e.getGraduationClassification())).count();
        long kha = evaluations.stream().filter(e -> "KHA".equalsIgnoreCase(e.getGraduationClassification())).count();
        long trungBinh = evaluations.stream().filter(e -> "TRUNG_BINH".equalsIgnoreCase(e.getGraduationClassification())).count();
        long khongDat = evaluations.stream().filter(e -> "KHONG_DAT".equalsIgnoreCase(e.getGraduationClassification())).count();

        return DashboardSummaryDTO.builder()
                .totalStudents(totalStudents)
                .eligibleStudentsCount(eligibleCount)
                .ineligibleStudentsCount(ineligibleCount)
                .passRatePercentage(Math.round(passRate * 10.0) / 10.0)
                .classificationCounts(Map.of(
                        "XUAT_SAC", xuatSac,
                        "GIOL", gioi,
                        "KHA", kha,
                        "TRUNG_BINH", trungBinh,
                        "KHONG_DAT", khongDat
                ))
                .build();
    }
}
