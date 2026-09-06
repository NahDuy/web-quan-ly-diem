package com.intranet.grade.repository;

import com.intranet.grade.entity.GradeAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GradeAuditLogRepository extends JpaRepository<GradeAuditLog, Long> {

    @Query("SELECT g FROM GradeAuditLog g WHERE (:classId IS NULL OR g.classId = :classId) AND (:subjectId IS NULL OR g.subjectId = :subjectId) AND (:studentId IS NULL OR g.studentId = :studentId) ORDER BY g.modifiedAt DESC")
    Page<GradeAuditLog> searchLogs(
            @Param("classId") Integer classId,
            @Param("subjectId") Integer subjectId,
            @Param("studentId") Long studentId,
            Pageable pageable
    );
}
