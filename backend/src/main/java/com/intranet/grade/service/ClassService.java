package com.intranet.grade.service;

import com.intranet.grade.dto.ClassSummaryDTO;
import com.intranet.grade.entity.ClassEntity;
import com.intranet.grade.entity.Course;
import com.intranet.grade.entity.Department;
import com.intranet.grade.entity.Major;
import com.intranet.grade.repository.ClassRepository;
import com.intranet.grade.repository.CourseRepository;
import com.intranet.grade.repository.DepartmentRepository;
import com.intranet.grade.repository.MajorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final MajorRepository majorRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<ClassSummaryDTO> getAllClasses() {
        return classRepository.findAll().stream()
                .map(c -> {
                    long count = studentRepository.findByClazzIdOrderByStudentCodeAsc(c.getId()).size();
                    return ClassSummaryDTO.builder()
                            .id(c.getId())
                            .code(c.getCode())
                            .name(c.getName())
                            .majorCode(c.getMajor() != null ? c.getMajor().getCode() : null)
                            .majorName(c.getMajor() != null ? c.getMajor().getName() : null)
                            .courseCode(c.getCourse() != null ? c.getCourse().getCode() : null)
                            .courseName(c.getCourse() != null ? c.getCourse().getName() : null)
                            .academicYear(c.getCourse() != null ? c.getCourse().getStartYear() : null)
                            .totalStudents(count)
                            .build();
                })
                .toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteClass(Integer classId) {
        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học với ID: " + classId));

        log.warn("Deleting class ID: {}, Code: {}", classId, clazz.getCode());

        // Cascade delete child records
        jdbcTemplate.update("DELETE FROM grades WHERE class_id = ?", classId);
        jdbcTemplate.update("DELETE FROM grade_audit_logs WHERE class_id = ?", classId);
        jdbcTemplate.update("DELETE FROM student_evaluations WHERE class_id = ?", classId);
        jdbcTemplate.update("DELETE FROM grade_locks WHERE class_id = ?", classId);
        jdbcTemplate.update("DELETE FROM class_subjects WHERE class_id = ?", classId);
        jdbcTemplate.update("DELETE FROM students WHERE class_id = ?", classId);
        jdbcTemplate.update("DELETE FROM classes WHERE id = ?", classId);

        log.info("Class {} and its associated data deleted successfully.", clazz.getCode());
    }

    @Transactional(rollbackFor = Exception.class)
    public int deleteAllClasses() {
        int count = (int) classRepository.count();
        log.warn("Deleting ALL classes, total to delete: {}", count);

        // Cascade delete all grade and student tables
        jdbcTemplate.update("DELETE FROM grades");
        jdbcTemplate.update("DELETE FROM grade_audit_logs");
        jdbcTemplate.update("DELETE FROM student_evaluations");
        jdbcTemplate.update("DELETE FROM grade_locks");
        jdbcTemplate.update("DELETE FROM class_subjects");
        jdbcTemplate.update("DELETE FROM students");
        jdbcTemplate.update("DELETE FROM classes");

        // Reset auto-increment sequences
        try {
            jdbcTemplate.execute("ALTER SEQUENCE IF EXISTS classes_id_seq RESTART WITH 1");
            jdbcTemplate.execute("ALTER SEQUENCE IF EXISTS students_id_seq RESTART WITH 1");
            jdbcTemplate.execute("ALTER SEQUENCE IF EXISTS grades_id_seq RESTART WITH 1");
            jdbcTemplate.execute("ALTER SEQUENCE IF EXISTS student_evaluations_id_seq RESTART WITH 1");
            jdbcTemplate.execute("ALTER SEQUENCE IF EXISTS grade_audit_logs_id_seq RESTART WITH 1");
            jdbcTemplate.execute("ALTER SEQUENCE IF EXISTS class_subjects_id_seq RESTART WITH 1");
            jdbcTemplate.execute("ALTER SEQUENCE IF EXISTS grade_locks_id_seq RESTART WITH 1");
        } catch (Exception e) {
            log.warn("Sequence reset warning: {}", e.getMessage());
        }

        log.info("All classes deleted and sequences reset.");
        return count;
    }
}
