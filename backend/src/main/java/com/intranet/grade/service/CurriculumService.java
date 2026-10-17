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
    private final MajorRepository majorRepository;
    private final SubjectRepository subjectRepository;

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
        return getAllCurriculums(majorCode, targetGroup, null);
    }

    @Transactional(readOnly = true)
    public List<com.intranet.grade.dto.CurriculumDTO> getAllCurriculums(String majorCode, String targetGroup, String courseCode) {
        List<Curriculum> list = curriculumRepository.findAll();
        List<com.intranet.grade.dto.CurriculumDTO> dtos = new ArrayList<>();

        for (Curriculum c : list) {
            if (majorCode != null && !majorCode.isBlank() && c.getMajor() != null) {
                if (!majorCode.equalsIgnoreCase(c.getMajor().getCode())) {
                    continue;
                }
            }

            if (courseCode != null && !courseCode.isBlank() && !"ALL".equalsIgnoreCase(courseCode) && c.getCourse() != null) {
                String cCourseCode = c.getCourse().getCode();
                boolean courseMatch = courseCode.equalsIgnoreCase(cCourseCode)
                        || cCourseCode.contains(courseCode)
                        || courseCode.contains(cCourseCode);
                if (!courseMatch) {
                    continue;
                }
            }

            String tg = "SQDB";
            String tgName = "Sĩ quan Dự bị (SQDB)";
            if (c.getName() != null) {
                String cNameUpper = c.getName().toUpperCase();
                String courseNameUpper = (c.getCourse() != null && c.getCourse().getName() != null) ? c.getCourse().getName().toUpperCase() : "";
                if (cNameUpper.contains("KHẨU ĐỘI") || courseNameUpper.contains("KHẨU ĐỘI") || cNameUpper.contains("KDT")) {
                    tg = "KDT";
                    tgName = "Khẩu đội trưởng (KĐT)";
                } else if (cNameUpper.contains("TIỂU ĐỘI") || courseNameUpper.contains("TIỂU ĐỘI") || cNameUpper.contains("TDT") || cNameUpper.contains("NẤU ĂN")) {
                    tg = "TDT";
                    tgName = "Tiểu đội trưởng (TĐT)";
                } else if (cNameUpper.contains("KỸ THUẬT") || courseNameUpper.contains("KỸ THUẬT") || cNameUpper.contains("NVKT") || cNameUpper.contains("QUÂN Y") || cNameUpper.contains("BẢO QUẢN") || cNameUpper.contains("BÁO VỤ")) {
                    tg = "NVKT";
                    tgName = "Nhân viên Kỹ thuật (NVKT)";
                } else if (cNameUpper.contains("HẠ SĨ QUAN") || courseNameUpper.contains("HẠ SĨ QUAN") || cNameUpper.contains("HSQ")) {
                    tg = "HSQ";
                    tgName = "Hạ sĩ quan Chỉ huy (HSQ)";
                }
            }

            if (targetGroup != null && !targetGroup.isBlank()) {
                String reqTgClean = targetGroup.toUpperCase().replaceAll("[^A-Z0-9]", "");
                String curTgClean = tg.toUpperCase().replaceAll("[^A-Z0-9]", "");
                boolean match = targetGroup.equalsIgnoreCase(tg)
                        || reqTgClean.contains(curTgClean)
                        || curTgClean.contains(reqTgClean)
                        || (targetGroup.toUpperCase().startsWith("SQDB") && tg.toUpperCase().startsWith("SQDB"))
                        || ("KDT".equalsIgnoreCase(targetGroup) && "KHAU_DOI_TRUONG".equalsIgnoreCase(tg))
                        || ("KHAU_DOI_TRUONG".equalsIgnoreCase(targetGroup) && "KDT".equalsIgnoreCase(tg))
                        || ("TDT".equalsIgnoreCase(targetGroup) && "TIEU_DOI_TRUONG".equalsIgnoreCase(tg))
                        || ("TIEU_DOI_TRUONG".equalsIgnoreCase(targetGroup) && "TDT".equalsIgnoreCase(tg));
                if (!match) {
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

        // Fallback: Nếu chưa có khung chương trình riêng cho ngành này hoặc dtos rỗng, tự động lấy danh mục môn học thuộc Khoa phụ trách hoặc môn học quân sự chung từ bảng subjects
        if (dtos.isEmpty() && majorCode != null && !majorCode.isBlank()) {
            Optional<Major> majorOpt = majorRepository.findByCode(majorCode);
            if (majorOpt.isPresent()) {
                Major m = majorOpt.get();
                List<Subject> allSubjects = subjectRepository.findAll();
                List<Subject> relevantSubjects = allSubjects.stream()
                        .filter(s -> (m.getDepartment() != null && s.getDepartment() != null && m.getDepartment().getId().equals(s.getDepartment().getId()))
                                || (s.getCode() != null && s.getCode().startsWith(m.getCode())))
                        .collect(Collectors.toList());

                // Nếu chưa có môn riêng theo khoa/ngành, bổ sung các môn quân sự chung và thi tốt nghiệp
                if (relevantSubjects.isEmpty()) {
                    relevantSubjects = allSubjects.stream()
                            .filter(s -> s.getCode() != null && (s.getCode().startsWith("QS") || s.getCode().startsWith("TN")))
                            .collect(Collectors.toList());
                }

                if (!relevantSubjects.isEmpty()) {
                    List<com.intranet.grade.dto.CurriculumSubjectDTO> subDTOs = new ArrayList<>();
                    int totalCredits = 0;
                    for (Subject s : relevantSubjects) {
                        int credits = s.getCredits() != null ? s.getCredits() : 3;
                        totalCredits += credits;
                        boolean isGradExam = s.getCode() != null && s.getCode().startsWith("TN");
                        subDTOs.add(com.intranet.grade.dto.CurriculumSubjectDTO.builder()
                                .id(s.getId())
                                .subjectCode(s.getCode())
                                .subjectName(s.getName())
                                .credits(credits)
                                .hours(credits * 15)
                                .semester(1)
                                .type(isGradExam ? "MON_THI_TOT_NGHIEP" : "MON_HOC_PHAN")
                                .examFormat(isGradExam ? "Vấn đáp / Thao trường" : "Lý thuyết & Thao trường")
                                .weight(isGradExam ? 2.0 : 1.0)
                                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : (m.getDepartment() != null ? m.getDepartment().getName() : "Khoa Binh chủng"))
                                .isCompulsory(true)
                                .build());
                    }
                    dtos.add(com.intranet.grade.dto.CurriculumDTO.builder()
                            .id(m.getId() + 1000)
                            .name("Lộ trình Đào tạo Khung - Chuyên ngành " + m.getName())
                            .majorId(m.getId())
                            .majorCode(m.getCode())
                            .majorName(m.getName())
                            .targetGroup(targetGroup != null ? targetGroup : "SQDB")
                            .targetGroupName(targetGroup != null ? targetGroup : "Sĩ quan Dự bị (SQDB)")
                            .courseCode(courseCode != null ? courseCode : "2026")
                            .courseName("Khung Đào tạo Năm " + (courseCode != null ? courseCode : "2026"))
                            .academicYear(2026)
                            .totalCredits(totalCredits)
                            .totalHours(totalCredits * 15)
                            .subjects(subDTOs)
                            .build());
                }
            }
        }

        return dtos;
    }
}
