package com.intranet.grade.service;

import com.intranet.grade.dto.MajorDTO;
import com.intranet.grade.dto.MajorRequest;
import com.intranet.grade.entity.Department;
import com.intranet.grade.entity.Major;
import com.intranet.grade.repository.ClassRepository;
import com.intranet.grade.repository.DepartmentRepository;
import com.intranet.grade.repository.MajorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MajorService {

    private final MajorRepository majorRepository;
    private final DepartmentRepository departmentRepository;
    private final ClassRepository classRepository;

    public List<MajorDTO> getAllMajors() {
        return majorRepository.findAllByOrderByIdAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MajorDTO createMajor(MajorRequest req) {
        String code = req.getCode().trim().toUpperCase();
        if (majorRepository.findByCode(code).isPresent()) {
            throw new IllegalArgumentException("Mã chuyên ngành '" + code + "' đã tồn tại trong hệ thống!");
        }

        Department dept = null;
        if (req.getDepartmentId() != null) {
            dept = departmentRepository.findById(req.getDepartmentId()).orElse(null);
        }

        Major major = Major.builder()
                .code(code)
                .name(req.getName().trim())
                .department(dept)
                .build();

        Major saved = majorRepository.save(major);
        return toDTO(saved);
    }

    @Transactional
    public MajorDTO updateMajor(Integer id, MajorRequest req) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chuyên ngành có ID: " + id));

        String newCode = req.getCode().trim().toUpperCase();
        if (!major.getCode().equalsIgnoreCase(newCode)) {
            if (majorRepository.findByCode(newCode).isPresent()) {
                throw new IllegalArgumentException("Mã chuyên ngành '" + newCode + "' đã tồn tại!");
            }
            major.setCode(newCode);
        }

        major.setName(req.getName().trim());

        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId()).orElse(null);
            major.setDepartment(dept);
        } else {
            major.setDepartment(null);
        }

        Major updated = majorRepository.save(major);
        return toDTO(updated);
    }

    @Transactional
    public void deleteMajor(Integer id) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chuyên ngành có ID: " + id));

        long classCount = classRepository.countByMajorId(id);
        if (classCount > 0) {
            throw new IllegalArgumentException("Không thể xóa chuyên ngành này vì đang có " + classCount + " lớp học trực thuộc!");
        }

        majorRepository.delete(major);
    }

    private MajorDTO toDTO(Major m) {
        long count = classRepository.countByMajorId(m.getId());
        return MajorDTO.builder()
                .id(m.getId())
                .code(m.getCode())
                .name(m.getName())
                .departmentId(m.getDepartment() != null ? m.getDepartment().getId() : null)
                .departmentName(m.getDepartment() != null ? m.getDepartment().getName() : "Chưa phân khoa")
                .classCount(count)
                .build();
    }
}