package com.intranet.grade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_code", nullable = false, unique = true, length = 30)
    private String studentCode;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(length = 150)
    private String pob; // Quê quán

    @Column(length = 10)
    private String gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity clazz;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(length = 30)
    @Builder.Default
    private String status = "DANG_HOC";
}
