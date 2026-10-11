package com.intranet.grade.service;

import com.intranet.grade.entity.Student;
import com.intranet.grade.entity.StudentEvaluation;
import com.intranet.grade.repository.MajorRepository;
import com.intranet.grade.repository.StudentEvaluationRepository;
import com.intranet.grade.repository.StudentRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final StudentEvaluationRepository evaluationRepository;
    private final MajorRepository majorRepository;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MajorBreakdownDTO {
        private String code;
        private String name;
        private long total;
        private double passRate;
        private double avgScore;
    }

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
        private List<MajorBreakdownDTO> majorBreakdown;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDTO getDashboardSummary() {
        List<Student> allStudents = studentRepository.findAll();
        long totalStudents = allStudents.size();
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

        Map<Integer, List<Student>> studentsByMajor = allStudents.stream()
                .filter(s -> s.getClazz() != null && s.getClazz().getMajor() != null)
                .collect(Collectors.groupingBy(s -> s.getClazz().getMajor().getId()));

        Map<Long, StudentEvaluation> evalByStudent = evaluations.stream()
                .filter(e -> e.getStudent() != null)
                .collect(Collectors.toMap(e -> e.getStudent().getId(), e -> e, (a, b) -> a));

        List<MajorBreakdownDTO> breakdowns = majorRepository.findAll().stream()
                .map(m -> {
                    List<Student> mStudents = studentsByMajor.getOrDefault(m.getId(), Collections.emptyList());
                    long total = mStudents.size();
                    if (total == 0) return null;
                    long passed = mStudents.stream()
                            .map(s -> evalByStudent.get(s.getId()))
                            .filter(e -> e != null && e.getFinalGraduationScore() != null && e.getFinalGraduationScore().doubleValue() >= 5.0)
                            .count();
                    double mPassRate = Math.round((double) passed / total * 1000.0) / 10.0;
                    double avgScore = mStudents.stream()
                            .map(s -> evalByStudent.get(s.getId()))
                            .filter(e -> e != null && e.getFinalGraduationScore() != null)
                            .mapToDouble(e -> e.getFinalGraduationScore().doubleValue())
                            .average().orElse(0.0);
                    avgScore = Math.round(avgScore * 100.0) / 100.0;

                    return MajorBreakdownDTO.builder()
                            .code(m.getCode())
                            .name(m.getName())
                            .total(total)
                            .passRate(mPassRate)
                            .avgScore(avgScore)
                            .build();
                })
                .filter(Objects::nonNull)
                .sorted((a, b) -> Long.compare(b.getTotal(), a.getTotal()))
                .collect(Collectors.toList());

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
                .majorBreakdown(breakdowns)
                .build();
    }
}
