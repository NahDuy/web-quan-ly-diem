package com.intranet.grade.repository;

import com.intranet.grade.entity.CurriculumSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CurriculumSubjectRepository extends JpaRepository<CurriculumSubject, Integer> {
    List<CurriculumSubject> findByCurriculumIdOrderBySemesterAsc(Integer curriculumId);
    List<CurriculumSubject> findByCurriculumIdAndSemesterOrderBySubjectCodeAsc(Integer curriculumId, Integer semester);
}
