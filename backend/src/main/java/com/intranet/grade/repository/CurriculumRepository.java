package com.intranet.grade.repository;

import com.intranet.grade.entity.Curriculum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CurriculumRepository extends JpaRepository<Curriculum, Integer> {
    Optional<Curriculum> findByMajorIdAndCourseId(Integer majorId, Integer courseId);
    java.util.List<Curriculum> findByMajorId(Integer majorId);
}
