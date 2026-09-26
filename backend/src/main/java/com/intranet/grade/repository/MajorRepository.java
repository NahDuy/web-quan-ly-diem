package com.intranet.grade.repository;

import com.intranet.grade.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MajorRepository extends JpaRepository<Major, Integer> {
    Optional<Major> findByCode(String code);
    List<Major> findAllByOrderByIdAsc();
}