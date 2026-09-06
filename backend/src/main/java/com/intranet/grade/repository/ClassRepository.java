package com.intranet.grade.repository;

import com.intranet.grade.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {
    Optional<ClassEntity> findByCode(String code);
}
