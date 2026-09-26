package com.intranet.grade.service;

import com.intranet.grade.dto.CreateStudentRequest;
import com.intranet.grade.dto.StudentDTO;
import com.intranet.grade.entity.ClassEntity;
import com.intranet.grade.entity.Student;
import com.intranet.grade.entity.StudentEvaluation;
import com.intranet.grade.repository.ClassRepository;
import com.intranet.grade.repository.StudentEvaluationRepository;
import com.intranet.grade.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final StudentEvaluationRepository studentEvaluationRepository;

    public List<StudentDTO> getAllStudents(Integer classId, Integer year) {
        List<Student> students;
        if (classId != null) {
            students = studentRepository.findByClazzIdOrderByStudentCodeAsc(classId);
        } else {
            students = studentRepository.findAll();
        }

        if (year != null) {
            students = students.stream()
                    .filter(s -> s.getClazz() != null && s.getClazz().getCourse() != null && year.equals(s.getClazz().getCourse().getAcademicYear()))
                    .collect(Collectors.toList());
        }

        return students.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDTO createStudent(CreateStudentRequest req) {
        String code = req.getStudentCode().toUpperCase().trim();
        if (studentRepository.findByStudentCode(code).isPresent()) {
            throw new IllegalArgumentException("Số hiệu học viên '" + code + "' đã tồn tại trong hệ thống!");
        }

        ClassEntity clazz = classRepository.findById(req.getClassId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp với ID: " + req.getClassId()));

        LocalDate dobDate;
        try {
            if (req.getDob() != null && req.getDob().contains("/")) {
                dobDate = LocalDate.parse(req.getDob().trim(), DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            } else if (req.getDob() != null && req.getDob().contains("-")) {
                dobDate = LocalDate.parse(req.getDob().trim());
            } else {
                dobDate = LocalDate.of(2003, 1, 1);
            }
        } catch (Exception e) {
            dobDate = LocalDate.of(2003, 1, 1);
        }

        Student student = Student.builder()
                .studentCode(code)
                .fullName(req.getFullName().trim())
                .dob(dobDate)
                .pob(req.getPob() != null && !req.getPob().isBlank() ? req.getPob().trim() : "Hà Nội")
                .gender(req.getGender() != null && !req.getGender().isBlank() ? req.getGender().trim() : "Nam")
                .clazz(clazz)
                .status("DANG_HUAN_LUYEN")
                .build();

        Student saved = studentRepository.save(student);

        // Tự động khởi tạo đánh giá & thi tốt nghiệp
        try {
            StudentEvaluation evaluation = StudentEvaluation.builder()
                    .student(saved)
                    .clazz(clazz)
                    .conductGrade("KHA")
                    .graduationClassification("CHUA_XET")
                    .build();
            studentEvaluationRepository.save(evaluation);
        } catch (Exception e) {
            log.warn("Warning creating student evaluation record: {}", e.getMessage());
        }

        return toDTO(saved);
    }

    @Transactional
    public StudentDTO updateStudent(Long id, CreateStudentRequest req) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học viên với ID: " + id));

        if (req.getStudentCode() != null && !req.getStudentCode().isBlank()) {
            String newCode = req.getStudentCode().toUpperCase().trim();
            studentRepository.findByStudentCode(newCode).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Số hiệu học viên '" + newCode + "' đã tồn tại!");
                }
            });
            student.setStudentCode(newCode);
        }

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            student.setFullName(req.getFullName().trim());
        }

        if (req.getDob() != null && !req.getDob().isBlank()) {
            try {
                if (req.getDob().contains("/")) {
                    student.setDob(LocalDate.parse(req.getDob().trim(), DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                } else if (req.getDob().contains("-")) {
                    student.setDob(LocalDate.parse(req.getDob().trim()));
                }
            } catch (Exception ignored) {}
        }

        if (req.getPob() != null) {
            student.setPob(req.getPob().trim());
        }

        if (req.getGender() != null) {
            student.setGender(req.getGender().trim());
        }

        if (req.getClassId() != null) {
            ClassEntity clazz = classRepository.findById(req.getClassId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp với ID: " + req.getClassId()));
            student.setClazz(clazz);
        }

        Student updated = studentRepository.save(student);
        return toDTO(updated);
    }

    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    private StudentDTO toDTO(Student s) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        Integer academicYear = null;
        if (s.getClazz() != null && s.getClazz().getCourse() != null) {
            academicYear = s.getClazz().getCourse().getAcademicYear();
        }
        return StudentDTO.builder()
                .id(s.getId())
                .studentCode(s.getStudentCode())
                .fullName(s.getFullName())
                .dob(s.getDob() != null ? s.getDob().format(dtf) : "")
                .pob(s.getPob())
                .gender(s.getGender())
                .classId(s.getClazz() != null ? s.getClazz().getId() : null)
                .className(s.getClazz() != null ? s.getClazz().getName() : "")
                .classCode(s.getClazz() != null ? s.getClazz().getCode() : "")
                .academicYear(academicYear)
                .rank("Học viên SQDB")
                .status(s.getStatus())
                .build();
    }
}
