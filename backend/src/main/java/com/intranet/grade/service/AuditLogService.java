package com.intranet.grade.service;

import com.intranet.grade.dto.AuditLogDTO;
import com.intranet.grade.entity.GradeAuditLog;
import com.intranet.grade.entity.Student;
import com.intranet.grade.entity.Subject;
import com.intranet.grade.entity.ClassEntity;
import com.intranet.grade.repository.GradeAuditLogRepository;
import com.intranet.grade.repository.StudentRepository;
import com.intranet.grade.repository.SubjectRepository;
import com.intranet.grade.repository.ClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final GradeAuditLogRepository auditLogRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;

    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getAuditLogs(Integer classId, Integer subjectId, Long studentId, int page, int size) {
        Page<GradeAuditLog> logs = auditLogRepository.searchLogs(classId, subjectId, studentId, PageRequest.of(page, size));

        Map<Long, Student> studentMap = studentRepository.findAllById(
                logs.getContent().stream().map(GradeAuditLog::getStudentId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Student::getId, s -> s));

        Map<Integer, Subject> subjectMap = subjectRepository.findAllById(
                logs.getContent().stream().map(GradeAuditLog::getSubjectId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Subject::getId, s -> s));

        Map<Integer, ClassEntity> classMap = classRepository.findAllById(
                logs.getContent().stream().map(GradeAuditLog::getClassId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(ClassEntity::getId, c -> c));

        return logs.map(log -> {
            Student student = studentMap.get(log.getStudentId());
            Subject subject = subjectMap.get(log.getSubjectId());
            ClassEntity clazz = classMap.get(log.getClassId());

            return AuditLogDTO.builder()
                    .id(log.getId())
                    .gradeId(log.getGradeId())
                    .studentId(log.getStudentId())
                    .studentCode(student != null ? student.getStudentCode() : "")
                    .studentName(student != null ? student.getFullName() : "")
                    .subjectId(log.getSubjectId())
                    .subjectCode(subject != null ? subject.getCode() : "")
                    .subjectName(subject != null ? subject.getName() : "")
                    .classId(log.getClassId())
                    .classCode(clazz != null ? clazz.getCode() : "")
                    .oldValue(log.getOldValue())
                    .newValue(log.getNewValue())
                    .reason(log.getReason())
                    .modifiedBy(log.getModifiedBy())
                    .modifiedByUsername(log.getModifiedByUsername())
                    .modifiedByRole(log.getModifiedByRole())
                    .modifiedAt(log.getModifiedAt())
                    .ipAddress(log.getIpAddress())
                    .build();
        });
    }
}
