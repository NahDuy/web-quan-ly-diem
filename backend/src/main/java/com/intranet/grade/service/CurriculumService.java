package com.intranet.grade.service;

import com.intranet.grade.dto.CurriculumProgressDTO;
import com.intranet.grade.entity.*;
import com.intranet.grade.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final ClassRepository classRepository;
    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public CurriculumProgressDTO getClassCurriculumProgress(Integer classId) {
        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học ID: " + classId));

        Curriculum curriculum = curriculumRepository.findByMajorIdAndCourseId(clazz.getMajor().getId(), clazz.getCourse().getId())
                .orElseThrow(() -> new IllegalArgumentException("Chưa thiết lập khung chương trình cho ngành & khóa này"));

        List<CurriculumSubject> curriculumSubjects = curriculumSubjectRepository.findByCurriculumIdOrderBySemesterAsc(curriculum.getId());
        List<Grade> classGrades = gradeRepository.findByClazzId(classId);
        List<Student> students = studentRepository.findByClazzIdOrderByStudentCodeAsc(classId);

        int totalStudents = Math.max(1, students.size());
        int totalCredits = curriculumSubjects.stream().mapToInt(cs -> cs.getSubject().getCredits()).sum();

        // Calculate completed credits per semester
        Map<Integer, List<CurriculumSubject>> semesterMap = curriculumSubjects.stream()
                .collect(Collectors.groupingBy(CurriculumSubject::getSemester));

        List<CurriculumProgressDTO.SemesterProgressDTO> semesterProgressList = new ArrayList<>();
        int completedCreditsSum = 0;

        for (int sem = 1; sem <= 8; sem++) {
            List<CurriculumSubject> subList = semesterMap.getOrDefault(sem, Collections.emptyList());
            if (subList.isEmpty()) continue;

            int semTotalSubjects = subList.size();
            int semTotalCredits = subList.stream().mapToInt(cs -> cs.getSubject().getCredits()).sum();

            int semPassedSubjectsCount = 0;
            int semEarnedCredits = 0;

            for (CurriculumSubject cs : subList) {
                long passedStudentsCount = classGrades.stream()
                        .filter(g -> g.getSubject().getId().equals(cs.getSubject().getId()) && "PASSED".equals(g.getStatus()))
                        .map(g -> g.getStudent().getId())
                        .distinct()
                        .count();

                if (passedStudentsCount >= (totalStudents * 0.5)) { // Considered passed by class majority
                    semPassedSubjectsCount++;
                    semEarnedCredits += cs.getSubject().getCredits();
                }
            }

            completedCreditsSum += semEarnedCredits;

            semesterProgressList.add(CurriculumProgressDTO.SemesterProgressDTO.builder()
                    .semester(sem)
                    .totalSubjects(semTotalSubjects)
                    .completedSubjects(semPassedSubjectsCount)
                    .totalCredits(semTotalCredits)
                    .earnedCredits(semEarnedCredits)
                    .build());
        }

        double percentage = totalCredits > 0 ? (double) completedCreditsSum / totalCredits * 100.0 : 0.0;

        return CurriculumProgressDTO.builder()
                .curriculumId(curriculum.getId())
                .curriculumName(curriculum.getName())
                .majorName(clazz.getMajor().getName())
                .courseName(clazz.getCourse().getName())
                .totalCredits(totalCredits)
                .completedCredits(completedCreditsSum)
                .completionPercentage(Math.round(percentage * 10.0) / 10.0)
                .semesterProgressList(semesterProgressList)
                .build();
    }
}
