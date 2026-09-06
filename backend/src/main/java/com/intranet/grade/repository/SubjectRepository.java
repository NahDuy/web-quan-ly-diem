package com.intranet.grade.repository;

import com.intranet.grade.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    Optional<Subject> findByCode(String code);

    @Query("SELECT cs.subject FROM CurriculumSubject cs JOIN cs.curriculum c JOIN ClassEntity cl ON cl.major = c.major AND cl.course = c.course WHERE cl.id = :classId ORDER BY cs.semester, cs.subject.code")
    List<Subject> findSubjectsByClassId(@Param("classId") Integer classId);

    @Query("SELECT cs.subject FROM CurriculumSubject cs JOIN cs.curriculum c JOIN ClassEntity cl ON cl.major = c.major AND cl.course = c.course WHERE cl.id = :classId AND cs.semester = :semester ORDER BY cs.subject.code")
    List<Subject> findSubjectsByClassIdAndSemester(@Param("classId") Integer classId, @Param("semester") Integer semester);
}
