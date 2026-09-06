package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "grades", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "subject_id", "class_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity clazz;

    @Column(nullable = false)
    private Integer semester;

    @Column(precision = 4, scale = 2)
    private BigDecimal score;

    @Column(length = 20)
    @Builder.Default
    private String status = "PENDING";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = ZonedDateTime.now();
        if (score != null) {
            this.status = score.doubleValue() >= 5.0 ? "PASSED" : "FAILED";
        } else {
            this.status = "PENDING";
        }
    }
}
