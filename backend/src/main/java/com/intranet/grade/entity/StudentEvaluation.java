package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "student_evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity clazz;

    @Column(name = "conduct_grade", length = 20)
    @Builder.Default
    private String conductGrade = "KHA"; // TOT, KHA, TRUNG_BINH, KEM

    @Column(name = "score_political", precision = 4, scale = 2)
    private BigDecimal scorePolitical; // Môn 1: Thi Chính trị

    @Column(name = "score_military", precision = 4, scale = 2)
    private BigDecimal scoreMilitary; // Môn 2: Thi Quân sự chung

    @Column(name = "score_specialty", precision = 4, scale = 2)
    private BigDecimal scoreSpecialty; // Môn 3: Thi Chuyên ngành

    @Column(name = "tbc_grad_exam", precision = 4, scale = 2)
    private BigDecimal tbcGradExam; // Điểm TN (TBC 3 môn thi TN)

    @Column(name = "final_graduation_score", precision = 4, scale = 2)
    private BigDecimal finalGraduationScore; // Điểm Tốt Nghiệp = (TB*1 + TN*2)/3

    @Column(name = "graduation_classification", length = 30)
    @Builder.Default
    private String graduationClassification = "CHUA_XET"; // XUAT_SAC, GIOI, KHA, TRUNG_BINH, KHONG_DAT

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = ZonedDateTime.now();
    }
}
