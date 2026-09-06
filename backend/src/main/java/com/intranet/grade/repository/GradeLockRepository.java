package com.intranet.grade.repository;

import com.intranet.grade.entity.GradeLock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GradeLockRepository extends JpaRepository<GradeLock, Integer> {
    Optional<GradeLock> findByClazzIdAndSubjectIdAndSemester(Integer classId, Integer subjectId, Integer semester);
    Optional<GradeLock> findByClazzIdAndSemesterAndSubjectIdIsNull(Integer classId, Integer semester);
}
