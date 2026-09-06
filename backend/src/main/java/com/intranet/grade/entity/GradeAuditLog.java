package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "grade_audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grade_id")
    private Long gradeId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;

    @Column(name = "class_id", nullable = false)
    private Integer classId;

    @Column(name = "old_value", precision = 4, scale = 2)
    private BigDecimal oldValue;

    @Column(name = "new_value", precision = 4, scale = 2)
    private BigDecimal newValue;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "modified_by", nullable = false)
    private Long modifiedBy;

    @Column(name = "modified_by_username", nullable = false, length = 50)
    private String modifiedByUsername;

    @Column(name = "modified_by_role", nullable = false, length = 50)
    private String modifiedByRole;

    @Column(name = "modified_at")
    private ZonedDateTime modifiedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(columnDefinition = "jsonb")
    private String metadata;

    @PrePersist
    public void onCreate() {
        if (this.modifiedAt == null) {
            this.modifiedAt = ZonedDateTime.now();
        }
    }
}
