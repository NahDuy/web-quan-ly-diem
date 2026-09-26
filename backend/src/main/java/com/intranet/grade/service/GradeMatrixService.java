package com.intranet.grade.service;

import com.intranet.grade.dto.*;
import com.intranet.grade.entity.*;
import com.intranet.grade.repository.*;
import com.intranet.grade.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeMatrixService {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final GradeRepository gradeRepository;
    private final StudentEvaluationRepository evaluationRepository;
    private final GradeAuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final GradeLockRepository gradeLockRepository;
    private final ClassSubjectRepository classSubjectRepository;
    private final CurriculumRepository curriculumRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;

    @Transactional
    public MatrixResponseDTO getClassMatrix(Integer classId, Integer semester) {
        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học có ID: " + classId));

        int sem = semester != null ? semester : 1;

        // Check Lock Status
        Optional<GradeLock> lockOpt = gradeLockRepository.findByClazzIdAndSemesterAndSubjectIdIsNull(classId, sem);
        boolean isLocked = lockOpt.isPresent() && lockOpt.get().getIsLocked();

        // 1. Fetch Subjects (From ClassSubjects if configured, else fallback to SubjectRepository)
        List<Subject> subjects = new ArrayList<>();
        List<ClassSubject> classSubjects = classSubjectRepository.findByClazzIdAndSemesterOrderByIsExtraAscDisplayOrderAsc(classId, sem);

        if (!classSubjects.isEmpty()) {
            subjects = classSubjects.stream().map(ClassSubject::getSubject).collect(Collectors.toList());
        } else {
            if (semester != null && semester > 0) {
                subjects = subjectRepository.findSubjectsByClassIdAndSemester(classId, semester);
            } else {
                subjects = subjectRepository.findSubjectsByClassId(classId);
            }
            if (subjects.isEmpty()) {
                subjects = autoPopulateSubjectsFromCurriculum(clazz, sem);
            }
        }

        List<SubjectColumnDTO> columns = subjects.stream().map(s -> SubjectColumnDTO.builder()
                .subjectId(s.getId())
                .subjectCode(s.getCode())
                .subjectName(s.getName())
                .credits(s.getCredits())
                .departmentId(s.getDepartment().getId())
                .departmentName(s.getDepartment().getName())
                .build()).collect(Collectors.toList());

        // 2. Fetch Students for rows
        List<Student> students = studentRepository.findByClazzIdOrderByStudentCodeAsc(classId);

        // 3. Fetch Grades
        List<Grade> grades;
        if (semester != null && semester > 0) {
            grades = gradeRepository.findByClazzIdAndSemester(classId, semester);
        } else {
            grades = gradeRepository.findByClazzId(classId);
        }

        Map<String, Grade> gradeMap = grades.stream()
                .collect(Collectors.toMap(
                        g -> g.getStudent().getId() + "_" + g.getSubject().getId(),
                        Function.identity(),
                        (g1, g2) -> g1
                ));

        // 4. Fetch Evaluations
        List<StudentEvaluation> evaluations = evaluationRepository.findByClazzId(classId);
        Map<Long, StudentEvaluation> evalMap = evaluations.stream()
                .collect(Collectors.toMap(e -> e.getStudent().getId(), Function.identity(), (e1, e2) -> e1));

        // 5. Build Rows
        List<StudentRowDTO> rows = new ArrayList<>();
        int stt = 1;

        for (Student s : students) {
            Map<Integer, GradeDetailDTO> studentGrades = new HashMap<>();
            double totalWeightedScore = 0.0;
            int totalCredits = 0;

            for (Subject sub : subjects) {
                String key = s.getId() + "_" + sub.getId();
                Grade g = gradeMap.get(key);
                if (g != null && g.getScore() != null) {
                    studentGrades.put(sub.getId(), GradeDetailDTO.builder()
                            .gradeId(g.getId())
                            .score(g.getScore())
                            .status(g.getStatus())
                            .updatedAt(g.getUpdatedAt())
                            .build());

                    totalWeightedScore += g.getScore().doubleValue() * sub.getCredits();
                    totalCredits += sub.getCredits();
                } else {
                    studentGrades.put(sub.getId(), GradeDetailDTO.builder()
                            .score(null)
                            .status("PENDING")
                            .build());
                }
            }

            BigDecimal tbcScore = null;
            if (totalCredits > 0) {
                double avg = totalWeightedScore / totalCredits;
                tbcScore = BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP);
            }

            StudentEvaluation eval = evalMap.get(s.getId());
            String conduct = eval != null && eval.getConductGrade() != null ? eval.getConductGrade() : "KHA";

            // 3 Graduation Exam Scores
            BigDecimal scorePol = eval != null ? eval.getScorePolitical() : null;
            BigDecimal scoreMil = eval != null ? eval.getScoreMilitary() : null;
            BigDecimal scoreSpe = eval != null ? eval.getScoreSpecialty() : null;

            BigDecimal tbcGradExamScore = null;
            int validGradExams = 0;
            double sumGradExam = 0.0;

            if (scorePol != null) { sumGradExam += scorePol.doubleValue(); validGradExams++; }
            if (scoreMil != null) { sumGradExam += scoreMil.doubleValue(); validGradExams++; }
            if (scoreSpe != null) { sumGradExam += scoreSpe.doubleValue(); validGradExams++; }

            if (validGradExams > 0) {
                tbcGradExamScore = BigDecimal.valueOf(sumGradExam / validGradExams).setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal finalGradScore = null;
            String classification = "KHÔNG ĐẠT";

            if (tbcScore != null && tbcGradExamScore != null) {
                double finalScoreVal = (tbcScore.doubleValue() * 1.0 + tbcGradExamScore.doubleValue() * 2.0) / 3.0;
                finalGradScore = BigDecimal.valueOf(finalScoreVal).setScale(2, RoundingMode.HALF_UP);

                if (finalGradScore.doubleValue() >= 9.0) {
                    classification = "XUẤT SẮC";
                } else if (finalGradScore.doubleValue() >= 8.0) {
                    classification = "GIỎI";
                } else if (finalGradScore.doubleValue() >= 6.5) {
                    classification = "KHÁ";
                } else if (finalGradScore.doubleValue() >= 5.0) {
                    classification = "TRUNG BÌNH";
                } else {
                    classification = "KHÔNG ĐẠT";
                }
            }

            Map<Integer, BigDecimal> gradExamScoresMap = new HashMap<>();
            if (scorePol != null) gradExamScoresMap.put(101, scorePol);
            if (scoreMil != null) gradExamScoresMap.put(102, scoreMil);
            if (scoreSpe != null) gradExamScoresMap.put(103, scoreSpe);

            rows.add(StudentRowDTO.builder()
                    .stt(stt++)
                    .studentId(s.getId())
                    .studentCode(s.getStudentCode())
                    .fullName(s.getFullName())
                    .dob(s.getDob())
                    .pob(s.getPob())
                    .gender(s.getGender())
                    .grades(studentGrades)
                    .tbcScore(tbcScore)
                    .conductGrade(conduct)
                    .gradExamScores(gradExamScoresMap)
                    .graduationExamScore(tbcGradExamScore)
                    .finalGraduationScore(finalGradScore)
                    .graduationClassification(classification)
                    .isEligibleForGraduation(true)
                    .build());
        }

        return MatrixResponseDTO.builder()
                .classId(clazz.getId())
                .classCode(clazz.getCode())
                .className(clazz.getName())
                .majorName(clazz.getMajor().getName())
                .courseName(clazz.getCourse().getName())
                .semester(sem)
                .isLocked(isLocked)
                .lockedAt(lockOpt.map(GradeLock::getLockedAt).orElse(null))
                .lockedByUsername(lockOpt.map(l -> l.getLockedBy() != null ? l.getLockedBy().getUsername() : null).orElse(null))
                .columns(columns)
                .rows(rows)
                .build();
    }

    @Transactional
    public void bulkUpdateMatrix(Integer classId, BulkUpdateMatrixRequest request, String clientIp) {
        CustomUserDetails currentUser = getCurrentUser();
        int sem = request.getSemester() != null ? request.getSemester() : 1;

        // Check if grade sheet is locked
        Optional<GradeLock> lockOpt = gradeLockRepository.findByClazzIdAndSemesterAndSubjectIdIsNull(classId, sem);
        if (lockOpt.isPresent() && lockOpt.get().getIsLocked()) {
            if (!Arrays.asList("ROLE_BGH", "ROLE_PDT").contains(currentUser.getRoleCode())) {
                throw new AccessDeniedException("BẢNG ĐIỂM ĐÃ BỊ KHÓA (LOCKED). Bạn không có quyền thay đổi.");
            }
        }

        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        User userEntity = userRepository.findById(currentUser.getId()).orElse(null);

        if (request.getGradeUpdates() != null) {
            for (GradeUpdateItem item : request.getGradeUpdates()) {
                Student student = studentRepository.findById(item.getStudentId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học viên ID: " + item.getStudentId()));
                Subject subject = subjectRepository.findById(item.getSubjectId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học ID: " + item.getSubjectId()));

                Grade grade = gradeRepository.findByStudentIdAndSubjectIdAndClazzId(item.getStudentId(), item.getSubjectId(), classId)
                        .orElseGet(() -> Grade.builder()
                                .student(student)
                                .subject(subject)
                                .clazz(clazz)
                                .semester(sem)
                                .build());

                BigDecimal oldScore = grade.getScore();
                grade.setScore(item.getScore());
                grade.setUpdatedBy(userEntity);
                grade = gradeRepository.saveAndFlush(grade);

                // Record Audit Log
                GradeAuditLog log = GradeAuditLog.builder()
                        .gradeId(grade.getId())
                        .studentId(student.getId())
                        .subjectId(subject.getId())
                        .classId(clazz.getId())
                        .oldValue(oldScore)
                        .newValue(item.getScore())
                        .reason(request.getReason())
                        .modifiedBy(currentUser.getId())
                        .modifiedByUsername(currentUser.getUsername())
                        .modifiedByRole(currentUser.getRoleCode())
                        .ipAddress(clientIp)
                        .build();
                auditLogRepository.save(log);
            }
        }

        if (request.getEvaluationUpdates() != null) {
            for (EvaluationUpdateItem item : request.getEvaluationUpdates()) {
                Student student = studentRepository.findById(item.getStudentId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học viên ID: " + item.getStudentId()));

                StudentEvaluation eval = evaluationRepository.findByStudentId(item.getStudentId())
                        .orElseGet(() -> StudentEvaluation.builder()
                                .student(student)
                                .clazz(clazz)
                                .conductGrade("KHA")
                                .graduationClassification("CHUA_XET")
                                .build());

                if (item.getConductGrade() != null) {
                    eval.setConductGrade(item.getConductGrade());
                }
                if (item.getScorePolitical() != null) {
                    eval.setScorePolitical(item.getScorePolitical());
                }
                if (item.getScoreMilitary() != null) {
                    eval.setScoreMilitary(item.getScoreMilitary());
                }
                if (item.getScoreSpecialty() != null) {
                    eval.setScoreSpecialty(item.getScoreSpecialty());
                }
                if (item.getGraduationExamScore() != null) {
                    eval.setTbcGradExam(item.getGraduationExamScore());
                } else if (eval.getScorePolitical() != null && eval.getScoreMilitary() != null && eval.getScoreSpecialty() != null) {
                    BigDecimal sum = eval.getScorePolitical().add(eval.getScoreMilitary()).add(eval.getScoreSpecialty());
                    eval.setTbcGradExam(sum.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP));
                }

                evaluationRepository.save(eval);
            }
        }
    }

    @Transactional
    public void lockMatrix(Integer classId, Integer semester) {
        CustomUserDetails currentUser = getCurrentUser();
        if (!Arrays.asList("ROLE_BGH", "ROLE_PDT").contains(currentUser.getRoleCode())) {
            throw new AccessDeniedException("Chỉ Ban Giám Đốc hoặc Phòng Đào Tạo mới có quyền khóa/niêm phong bảng điểm.");
        }

        int sem = semester != null ? semester : 1;
        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        GradeLock lock = gradeLockRepository.findByClazzIdAndSemesterAndSubjectIdIsNull(classId, sem)
                .orElseGet(() -> GradeLock.builder().clazz(clazz).semester(sem).build());

        lock.setIsLocked(true);
        lock.setLockedAt(ZonedDateTime.now());
        lock.setLockedBy(userRepository.findById(currentUser.getId()).orElse(null));
        gradeLockRepository.save(lock);
    }

    @Transactional
    public void unlockMatrix(Integer classId, Integer semester) {
        CustomUserDetails currentUser = getCurrentUser();
        if (!Arrays.asList("ROLE_BGH", "ROLE_PDT").contains(currentUser.getRoleCode())) {
            throw new AccessDeniedException("Chỉ Ban Giám Đốc hoặc Phòng Đào Tạo mới có quyền mở khóa bảng điểm.");
        }

        int sem = semester != null ? semester : 1;
        Optional<GradeLock> lockOpt = gradeLockRepository.findByClazzIdAndSemesterAndSubjectIdIsNull(classId, sem);

        if (lockOpt.isPresent()) {
            GradeLock lock = lockOpt.get();
            lock.setIsLocked(false);
            lock.setUnlockedAt(ZonedDateTime.now());
            lock.setUnlockedBy(userRepository.findById(currentUser.getId()).orElse(null));
            gradeLockRepository.save(lock);
        }
    }

    @Transactional
    public void addSubjectToClass(Integer classId, Integer semester, Integer subjectId, Boolean isExtra) {
        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học: " + classId));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học: " + subjectId));

        int sem = semester != null ? semester : 1;
        if (!classSubjectRepository.existsByClazzIdAndSubjectIdAndSemester(classId, subjectId, sem)) {
            ClassSubject cs = ClassSubject.builder()
                    .clazz(clazz)
                    .subject(subject)
                    .semester(sem)
                    .isExtra(isExtra != null ? isExtra : true)
                    .displayOrder(100)
                    .build();
            classSubjectRepository.save(cs);
        }
    }

    @Transactional
    public List<Subject> initializeClassMatrixFromCurriculum(Integer classId, Integer semester) {
        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học: " + classId));
        int sem = semester != null ? semester : 1;
        return autoPopulateSubjectsFromCurriculum(clazz, sem);
    }

    @Transactional
    public List<Subject> autoPopulateSubjectsFromCurriculum(ClassEntity clazz, int sem) {
        if (clazz.getMajor() == null) return Collections.emptyList();

        Integer majorId = clazz.getMajor().getId();
        Integer courseId = clazz.getCourse() != null ? clazz.getCourse().getId() : null;

        Curriculum curriculum = null;
        if (courseId != null) {
            curriculum = curriculumRepository.findByMajorIdAndCourseId(majorId, courseId).orElse(null);
        }
        if (curriculum == null) {
            List<Curriculum> list = curriculumRepository.findByMajorId(majorId);
            if (!list.isEmpty()) {
                curriculum = list.get(0);
            }
        }

        if (curriculum == null) {
            return Collections.emptyList();
        }

        List<CurriculumSubject> cSubs = curriculumSubjectRepository.findByCurriculumIdOrderBySemesterAsc(curriculum.getId());
        List<CurriculumSubject> targetList = cSubs.stream()
                .filter(cs -> cs.getSemester().equals(sem))
                .toList();
        if (targetList.isEmpty()) {
            targetList = cSubs;
        }

        List<Subject> result = new ArrayList<>();
        int order = 1;
        for (CurriculumSubject cs : targetList) {
            Subject s = cs.getSubject();
            result.add(s);

            if (!classSubjectRepository.existsByClazzIdAndSubjectIdAndSemester(clazz.getId(), s.getId(), sem)) {
                classSubjectRepository.save(ClassSubject.builder()
                        .clazz(clazz)
                        .subject(s)
                        .semester(sem)
                        .isExtra(false)
                        .displayOrder(order++)
                        .build());
            }

            List<Student> students = studentRepository.findByClazzIdOrderByStudentCodeAsc(clazz.getId());
            for (Student st : students) {
                if (gradeRepository.findByStudentIdAndSubjectIdAndClazzId(st.getId(), s.getId(), clazz.getId()).isEmpty()) {
                    gradeRepository.save(Grade.builder()
                            .student(st)
                            .subject(s)
                            .clazz(clazz)
                            .semester(sem)
                            .score(null)
                            .status("PENDING")
                            .build());
                }
            }
        }
        return result;
    }

    private CustomUserDetails getCurrentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
