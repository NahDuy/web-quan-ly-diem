package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "class_subjects", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"class_id", "subject_id", "semester"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity clazz;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "is_extra", nullable = false)
    @Builder.Default
    private Boolean isExtra = false;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 1;

    @Column(name = "weight", precision = 3, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal weight = BigDecimal.valueOf(1.00);

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = ZonedDateTime.now();
    }
}
