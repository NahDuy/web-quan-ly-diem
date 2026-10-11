package com.intranet.grade.service;

import com.intranet.grade.dto.SystemHealthDTO;
import com.intranet.grade.entity.*;
import com.intranet.grade.repository.*;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemAdminService {

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    private final ClassRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final GradeAuditLogRepository auditLogRepository;
    private final GradeLockRepository gradeLockRepository;
    private final StudentEvaluationRepository evaluationRepository;
    private final ClassSubjectRepository classSubjectRepository;

    public SystemHealthDTO getSystemHealth() {
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        long maxMemory = runtime.maxMemory();

        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        Duration duration = Duration.ofMillis(uptimeMillis);
        String formattedUptime = String.format("%d ngày, %d giờ, %d phút, %d giây",
                duration.toDays(),
                duration.toHoursPart(),
                duration.toMinutesPart(),
                duration.toSecondsPart());

        double usagePercent = ((double) usedMemory / (double) maxMemory) * 100.0;
        BigDecimal usagePercentBd = BigDecimal.valueOf(usagePercent).setScale(1, RoundingMode.HALF_UP);

        // Database Pool Info
        int activeConn = 0;
        int idleConn = 0;
        int totalConn = 0;
        String dbStatus = "ONLINE (Kết nối ổn định)";

        try {
            if (dataSource instanceof HikariDataSource hikari) {
                activeConn = hikari.getHikariPoolMXBean() != null ? hikari.getHikariPoolMXBean().getActiveConnections() : 0;
                idleConn = hikari.getHikariPoolMXBean() != null ? hikari.getHikariPoolMXBean().getIdleConnections() : 0;
                totalConn = hikari.getHikariPoolMXBean() != null ? hikari.getHikariPoolMXBean().getTotalConnections() : 0;
            }
        } catch (Exception e) {
            log.warn("Could not retrieve Hikari connection pool metrics: {}", e.getMessage());
            dbStatus = "ONLINE (Metrics unavailable)";
        }

        // Entity counts
        long studentsCount = studentRepository.count();
        long gradesCount = gradeRepository.count();
        long classesCount = classRepository.count();
        long subjectsCount = subjectRepository.count();
        long deptCount = departmentRepository.count();
        long usersCount = userRepository.count();
        long auditCount = auditLogRepository.count();

        // Integrity Overview
        Map<String, Object> integrity = new LinkedHashMap<>();
        try {
            Integer unassignedStudents = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM students WHERE class_id IS NULL", Integer.class);
            Integer emptyClasses = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM classes c WHERE NOT EXISTS (SELECT 1 FROM students s WHERE s.class_id = c.id)", Integer.class);
            Integer lockedClasses = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM grade_locks WHERE is_locked = true", Integer.class);

            integrity.put("unassignedStudents", unassignedStudents != null ? unassignedStudents : 0);
            integrity.put("emptyClasses", emptyClasses != null ? emptyClasses : 0);
            integrity.put("lockedClassesCount", lockedClasses != null ? lockedClasses : 0);
            integrity.put("databaseEncoding", "UTF-8");
        } catch (Exception e) {
            log.debug("Integrity query notice: {}", e.getMessage());
        }

        return SystemHealthDTO.builder()
                .status("HEALTHY")
                .uptime(formattedUptime)
                .uptimeSeconds(duration.toSeconds())
                .jvmHeapUsedMb(usedMemory / (1024 * 1024))
                .jvmHeapTotalMb(totalMemory / (1024 * 1024))
                .jvmHeapMaxMb(maxMemory / (1024 * 1024))
                .jvmHeapUsagePercent(usagePercentBd.doubleValue())
                .availableProcessors(runtime.availableProcessors())
                .javaVersion(System.getProperty("java.version"))
                .osName(System.getProperty("os.name") + " (" + System.getProperty("os.arch") + ")")
                .dbStatus(dbStatus)
                .dbActiveConnections(activeConn)
                .dbIdleConnections(idleConn)
                .dbTotalConnections(totalConn)
                .totalStudents(studentsCount)
                .totalGrades(gradesCount)
                .totalClasses(classesCount)
                .totalSubjects(subjectsCount)
                .totalDepartments(deptCount)
                .totalUsers(usersCount)
                .totalAuditLogs(auditCount)
                .integrityOverview(integrity)
                .build();
    }

    public Map<String, Object> fixPostgresSequences() {
        String[] tables = {
                "students", "users", "classes", "subjects", "grades",
                "student_evaluations", "grade_audit_logs", "class_subjects",
                "courses", "majors", "departments", "roles", "curriculums",
                "curriculum_subjects", "grade_locks", "teacher_subjects"
        };

        List<String> synchronizedTables = new ArrayList<>();
        List<String> skippedTables = new ArrayList<>();

        for (String table : tables) {
            try {
                jdbcTemplate.execute(
                        "SELECT setval(pg_get_serial_sequence('" + table + "', 'id'), COALESCE((SELECT max(id) FROM " + table + "), 1));"
                );
                synchronizedTables.add(table);
            } catch (Exception e) {
                skippedTables.add(table + " (" + e.getMessage() + ")");
            }
        }

        log.info("Admin fixed sequences. Synchronized: {}, Skipped: {}", synchronizedTables.size(), skippedTables.size());

        return Map.of(
                "success", true,
                "message", "Đã đồng bộ lại Sequence ID thành công cho " + synchronizedTables.size() + " bảng dữ liệu!",
                "synchronizedCount", synchronizedTables.size(),
                "tables", synchronizedTables,
                "skipped", skippedTables
        );
    }

    @Transactional
    public Map<String, Object> recalculateAllGrades() {
        List<ClassEntity> classes = classRepository.findAll();
        int totalStudentsProcessed = 0;
        int evaluationsUpdated = 0;

        for (ClassEntity clazz : classes) {
            List<Student> students = studentRepository.findByClazzIdOrderByStudentCodeAsc(clazz.getId());
            if (students.isEmpty()) continue;

            // Get all subjects configured for this class (semester 1 default)
            List<ClassSubject> classSubjects = classSubjectRepository.findByClazzIdAndSemesterOrderByIsExtraAscDisplayOrderAsc(clazz.getId(), 1);
            Map<Integer, Integer> subjectCreditMap = new HashMap<>();
            for (ClassSubject cs : classSubjects) {
                if (cs.getSubject() != null) {
                    subjectCreditMap.put(cs.getSubject().getId(), cs.getSubject().getCredits() != null ? cs.getSubject().getCredits() : 3);
                }
            }

            for (Student student : students) {
                totalStudentsProcessed++;
                List<Grade> grades = gradeRepository.findByStudentId(student.getId());

                double totalWeightedScore = 0;
                int totalCredits = 0;

                for (Grade g : grades) {
                    if (g.getScore() != null && g.getSubject() != null) {
                        int credits = subjectCreditMap.getOrDefault(g.getSubject().getId(),
                                g.getSubject().getCredits() != null ? g.getSubject().getCredits() : 3);
                        totalWeightedScore += g.getScore().doubleValue() * credits;
                        totalCredits += credits;
                    }
                }

                Double tbcScore = totalCredits > 0
                        ? BigDecimal.valueOf(totalWeightedScore / totalCredits).setScale(2, RoundingMode.HALF_UP).doubleValue()
                        : null;

                StudentEvaluation eval = evaluationRepository.findByStudentId(student.getId())
                        .orElseGet(() -> StudentEvaluation.builder()
                                .student(student)
                                .clazz(clazz)
                                .conductGrade("KHA")
                                .graduationClassification("CHUA_XET")
                                .build());

                // Calculate graduation exam scores if 3 exam subjects exist
                if (eval.getScorePolitical() != null && eval.getScoreMilitary() != null && eval.getScoreSpecialty() != null) {
                    BigDecimal sum = eval.getScorePolitical().add(eval.getScoreMilitary()).add(eval.getScoreSpecialty());
                    BigDecimal tbcGradExam = sum.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
                    eval.setTbcGradExam(tbcGradExam);

                    if (tbcScore != null) {
                        BigDecimal finalGradScore = BigDecimal.valueOf(tbcScore).multiply(BigDecimal.ONE)
                                .add(tbcGradExam.multiply(BigDecimal.valueOf(2)))
                                .divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
                        eval.setFinalGraduationScore(finalGradScore);
                        eval.setGraduationClassification(determineClassification(finalGradScore.doubleValue()));
                        student.setStatus("DA_TOT_NGHIEP");
                        studentRepository.save(student);
                    }
                }

                evaluationRepository.save(eval);
                evaluationsUpdated++;
            }
        }

        log.info("Admin triggered grade recalculation. Processed {} students, updated {} evaluations across {} classes.",
                totalStudentsProcessed, evaluationsUpdated, classes.size());

        return Map.of(
                "success", true,
                "message", "Đã quét và tính toán lại điểm TBC thành công cho " + totalStudentsProcessed + " học viên thuộc " + classes.size() + " lớp!",
                "studentsProcessed", totalStudentsProcessed,
                "evaluationsUpdated", evaluationsUpdated,
                "classesCount", classes.size()
        );
    }

    @Transactional
    public Map<String, Object> emergencyUnlockAllClasses() {
        List<GradeLock> locks = gradeLockRepository.findAll();
        int unlockedCount = 0;
        for (GradeLock lock : locks) {
            if (Boolean.TRUE.equals(lock.getIsLocked())) {
                lock.setIsLocked(false);
                lock.setLockedAt(null);
                lock.setLockedBy(null);
                gradeLockRepository.save(lock);
                unlockedCount++;
            }
        }

        log.info("Admin executed emergency unlock on {} locked tables.", unlockedCount);

        return Map.of(
                "success", true,
                "message", "Đã mở khóa khẩn cấp thành công cho " + unlockedCount + " bảng điểm đang bị khóa!",
                "unlockedCount", unlockedCount
        );
    }

    public Map<String, Object> optimizeDatabase() {
        try {
            // Cleanup orphaned records if any
            int cleanedAuditLogs = jdbcTemplate.update(
                    "DELETE FROM grade_audit_logs WHERE performed_at < NOW() - INTERVAL '365 days'"
            );

            return Map.of(
                "success", true,
                "message", "Đã dọn dẹp và tối ưu hóa hệ thống thành công!",
                "cleanedLogsCount", cleanedAuditLogs
            );
        } catch (Exception e) {
            log.error("Optimize database error: {}", e.getMessage());
            return Map.of(
                "success", false,
                "message", "Lỗi khi tối ưu hóa: " + e.getMessage()
            );
        }
    }

    public Map<String, Object> getDataIntegrityReport() {
        Map<String, Object> report = new LinkedHashMap<>();

        try {
            List<Map<String, Object>> unassignedStudents = jdbcTemplate.queryForList(
                    "SELECT id, student_code, full_name FROM students WHERE class_id IS NULL LIMIT 20"
            );
            List<Map<String, Object>> emptyClasses = jdbcTemplate.queryForList(
                    "SELECT c.id, c.code, c.name FROM classes c WHERE NOT EXISTS (SELECT 1 FROM students s WHERE s.class_id = c.id)"
            );
            List<Map<String, Object>> subjectsWithoutDept = jdbcTemplate.queryForList(
                    "SELECT id, code, name FROM subjects WHERE department_id IS NULL"
            );
            List<Map<String, Object>> usersWithoutRole = jdbcTemplate.queryForList(
                    "SELECT id, username, full_name FROM users WHERE role_id IS NULL"
            );

            report.put("unassignedStudentsCount", unassignedStudents.size());
            report.put("unassignedStudents", unassignedStudents);
            report.put("emptyClassesCount", emptyClasses.size());
            report.put("emptyClasses", emptyClasses);
            report.put("subjectsWithoutDeptCount", subjectsWithoutDept.size());
            report.put("subjectsWithoutDept", subjectsWithoutDept);
            report.put("usersWithoutRoleCount", usersWithoutRole.size());
            report.put("usersWithoutRole", usersWithoutRole);
            report.put("isHealthy", unassignedStudents.isEmpty() && subjectsWithoutDept.isEmpty() && usersWithoutRole.isEmpty());

        } catch (Exception e) {
            log.error("Data integrity report error: {}", e.getMessage());
            report.put("error", e.getMessage());
        }

        return report;
    }

    private String determineClassification(Double score) {
        if (score == null) return "CHƯA XẾP LOẠI";
        if (score >= 9.0) return "XUẤT SẮC";
        if (score >= 8.0) return "GIỎI";
        if (score >= 6.5) return "KHÁ";
        if (score >= 5.0) return "TRUNG BÌNH";
        return "YẾU";
    }
}
