package com.intranet.grade.repository;

import com.intranet.grade.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByCode(String code);
}
