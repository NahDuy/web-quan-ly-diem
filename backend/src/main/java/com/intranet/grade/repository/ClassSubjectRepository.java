package com.intranet.grade.repository;

import com.intranet.grade.entity.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassSubjectRepository extends JpaRepository<ClassSubject, Integer> {

    List<ClassSubject> findByClazzIdAndSemesterOrderByIsExtraAscDisplayOrderAsc(Integer classId, Integer semester);

    Optional<ClassSubject> findByClazzIdAndSubjectIdAndSemester(Integer classId, Integer subjectId, Integer semester);

    boolean existsByClazzIdAndSubjectIdAndSemester(Integer classId, Integer subjectId, Integer semester);
}
