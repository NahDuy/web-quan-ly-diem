package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "grade_locks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"class_id", "subject_id", "semester"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity clazz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(nullable = false)
    @Builder.Default
    private Integer semester = 1;

    @Column(name = "is_locked", nullable = false)
    @Builder.Default
    private Boolean isLocked = false;

    @Column(name = "locked_at")
    private ZonedDateTime lockedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by")
    private User lockedBy;

    @Column(name = "unlocked_at")
    private ZonedDateTime unlockedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unlocked_by")
    private User unlockedBy;
}
