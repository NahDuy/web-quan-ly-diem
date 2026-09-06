package com.intranet.grade.repository;

import com.intranet.grade.entity.StudentEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentEvaluationRepository extends JpaRepository<StudentEvaluation, Long> {
    Optional<StudentEvaluation> findByStudentId(Long studentId);
    List<StudentEvaluation> findByClazzId(Integer classId);
}
