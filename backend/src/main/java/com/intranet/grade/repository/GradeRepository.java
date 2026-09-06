package com.intranet.grade.repository;

import com.intranet.grade.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByClazzId(Integer classId);
    List<Grade> findByClazzIdAndSemester(Integer classId, Integer semester);
    List<Grade> findByStudentId(Long studentId);
    Optional<Grade> findByStudentIdAndSubjectIdAndClazzId(Long studentId, Integer subjectId, Integer classId);
}
