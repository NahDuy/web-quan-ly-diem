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

    @Transactional(readOnly = true)
    public List<com.intranet.grade.dto.CurriculumDTO> getAllCurriculums(String majorCode, String targetGroup) {
        List<Curriculum> list = curriculumRepository.findAll();
        List<com.intranet.grade.dto.CurriculumDTO> dtos = new ArrayList<>();

        for (Curriculum c : list) {
            if (majorCode != null && !majorCode.isBlank() && c.getMajor() != null) {
                if (!majorCode.equalsIgnoreCase(c.getMajor().getCode())) {
                    continue;
                }
            }

            String tg = "SQDB";
            String tgName = "Sĩ quan Dự bị";
            if (c.getName() != null) {
                if (c.getName().contains("Khẩu đội trưởng") || (c.getCourse() != null && c.getCourse().getName() != null && c.getCourse().getName().contains("Khẩu đội trưởng"))) {
                    tg = "KHAU_DOI_TRUONG";
                    tgName = "Khẩu đội trưởng";
                } else if (c.getName().contains("Tiểu đội trưởng") || (c.getCourse() != null && c.getCourse().getName() != null && c.getCourse().getName().contains("Tiểu đội trưởng"))) {
                    tg = "TIEU_DOI_TRUONG";
                    tgName = "Tiểu đội trưởng";
                }
            }

            if (targetGroup != null && !targetGroup.isBlank()) {
                if (!targetGroup.equalsIgnoreCase(tg)) {
                    continue;
                }
            }

            List<CurriculumSubject> cSubjects = curriculumSubjectRepository.findByCurriculumIdOrderBySemesterAsc(c.getId());
            List<com.intranet.grade.dto.CurriculumSubjectDTO> subDTOs = new ArrayList<>();
            int totalHours = 0;
            int totalCredits = 0;

            for (CurriculumSubject cs : cSubjects) {
                Subject s = cs.getSubject();
                int credits = s.getCredits() != null ? s.getCredits() : 3;
                int hours = credits * 15;
                totalCredits += credits;
                totalHours += hours;

                boolean isGradExam = s.getCode() != null && s.getCode().startsWith("TN");
                String examFormat = "Lý thuyết & Thao trường";
                double weight = 1.0;
                if (s.getCode() != null) {
                    if (s.getCode().startsWith("QS101")) examFormat = "Thực hành bắn đạn thật";
                    else if (s.getCode().startsWith("QS102")) examFormat = "Thực hành thao trường";
                    else if (s.getCode().startsWith("QS104")) examFormat = "Đọc bản đồ thực địa";
                    else if (s.getCode().startsWith("TN01")) { examFormat = "Vấn đáp lý thuyết"; weight = 1.0; }
                    else if (s.getCode().startsWith("TN02")) { examFormat = "Thực hành thao trường"; weight = 2.0; }
                    else if (s.getCode().startsWith("TN03")) { examFormat = "Thực hành chuyên ngành tác chiến"; weight = 2.0; }
                }

                subDTOs.add(com.intranet.grade.dto.CurriculumSubjectDTO.builder()
                        .id(cs.getId())
                        .subjectCode(s.getCode())
                        .subjectName(s.getName())
                        .credits(credits)
                        .hours(hours)
                        .semester(cs.getSemester())
                        .type(isGradExam ? "MON_THI_TOT_NGHIEP" : "MON_HOC_PHAN")
                        .examFormat(examFormat)
                        .weight(weight)
                        .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : "Khoa Binh chủng")
                        .isCompulsory(cs.getIsCompulsory())
                        .build());
            }

            // If no grad exam subjects yet, add standard military TN01, TN02, TN03
            boolean hasGradExam = subDTOs.stream().anyMatch(sub -> "MON_THI_TOT_NGHIEP".equals(sub.getType()));
            if (!hasGradExam) {
                subDTOs.add(com.intranet.grade.dto.CurriculumSubjectDTO.builder()
                        .subjectCode("TN01")
                        .subjectName("Thi Tốt nghiệp môn Chính trị")
                        .credits(2)
                        .hours(30)
                        .semester(1)
                        .type("MON_THI_TOT_NGHIEP")
                        .examFormat("Vấn đáp lý thuyết")
                        .weight(1.0)
                        .departmentName("Khoa Chính trị")
                        .isCompulsory(true)
                        .build());

                subDTOs.add(com.intranet.grade.dto.CurriculumSubjectDTO.builder()
                        .subjectCode("TN02")
                        .subjectName("Thi Tốt nghiệp môn Quân sự chung")
                        .credits(3)
                        .hours(45)
                        .semester(1)
                        .type("MON_THI_TOT_NGHIEP")
                        .examFormat("Thực hành thao trường")
                        .weight(2.0)
                        .departmentName("Khoa Quân sự chung")
                        .isCompulsory(true)
                        .build());

                subDTOs.add(com.intranet.grade.dto.CurriculumSubjectDTO.builder()
                        .subjectCode("TN03")
                        .subjectName("Thi Tốt nghiệp môn Chuyên ngành " + (c.getMajor() != null ? c.getMajor().getName() : ""))
                        .credits(4)
                        .hours(60)
                        .semester(1)
                        .type("MON_THI_TOT_NGHIEP")
                        .examFormat("Thực hành chuyên ngành tác chiến")
                        .weight(2.0)
                        .departmentName("Khoa Binh chủng")
                        .isCompulsory(true)
                        .build());

                totalCredits += 9;
                totalHours += 135;
            }

            dtos.add(com.intranet.grade.dto.CurriculumDTO.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .majorId(c.getMajor() != null ? c.getMajor().getId() : null)
                    .majorCode(c.getMajor() != null ? c.getMajor().getCode() : "")
                    .majorName(c.getMajor() != null ? c.getMajor().getName() : "")
                    .targetGroup(tg)
                    .targetGroupName(tgName)
                    .courseId(c.getCourse() != null ? c.getCourse().getId() : null)
                    .courseCode(c.getCourse() != null ? c.getCourse().getCode() : "")
                    .courseName(c.getCourse() != null ? c.getCourse().getName() : "")
                    .academicYear(c.getCourse() != null ? c.getCourse().getAcademicYear() : 2026)
                    .totalCredits(totalCredits)
                    .totalHours(totalHours)
                    .subjects(subDTOs)
                    .build());
        }
        return dtos;
    }
}
