package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "curriculums", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"major_id", "course_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Curriculum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "major_id", nullable = false)
    private Major major;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "total_credits", nullable = false)
    @Builder.Default
    private Integer totalCredits = 0;

    @OneToMany(mappedBy = "curriculum", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CurriculumSubject> curriculumSubjects = new ArrayList<>();
}
