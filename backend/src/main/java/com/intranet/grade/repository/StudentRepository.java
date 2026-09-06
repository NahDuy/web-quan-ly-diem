package com.intranet.grade.repository;

import com.intranet.grade.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByClazzIdOrderByStudentCodeAsc(Integer classId);
    Optional<Student> findByStudentCode(String studentCode);
    Optional<Student> findByUserId(Long userId);
}
