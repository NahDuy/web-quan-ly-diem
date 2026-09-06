package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "curriculum_subjects", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"curriculum_id", "subject_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurriculumSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false)
    private Integer semester;

    @Column(name = "is_compulsory")
    @Builder.Default
    private Boolean isCompulsory = true;
}
