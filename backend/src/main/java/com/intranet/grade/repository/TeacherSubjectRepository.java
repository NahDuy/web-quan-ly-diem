package com.intranet.grade.repository;

import com.intranet.grade.entity.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Long> {

    List<TeacherSubject> findByTeacherId(Long teacherId);

    List<TeacherSubject> findBySubjectId(Integer subjectId);

    Optional<TeacherSubject> findByTeacherIdAndSubjectId(Long teacherId, Integer subjectId);

    boolean existsByTeacherIdAndSubjectId(Long teacherId, Integer subjectId);

    @Modifying
    @Query("DELETE FROM TeacherSubject ts WHERE ts.teacher.id = :teacherId AND ts.subject.id = :subjectId")
    void deleteByTeacherIdAndSubjectId(@Param("teacherId") Long teacherId, @Param("subjectId") Integer subjectId);

    @Modifying
    @Query("DELETE FROM TeacherSubject ts WHERE ts.teacher.id = :teacherId")
    void deleteByTeacherId(@Param("teacherId") Long teacherId);
}
