package com.intranet.grade.service;

import com.intranet.grade.dto.*;
import com.intranet.grade.entity.*;
import com.intranet.grade.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final PasswordEncoder passwordEncoder;

    public List<DepartmentDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        List<Subject> allSubjects = subjectRepository.findAll();
        List<User> allUsers = userRepository.findAll();

        Map<Integer, Long> subjectCountMap = allSubjects.stream()
                .filter(s -> s.getDepartment() != null)
                .collect(Collectors.groupingBy(s -> s.getDepartment().getId(), Collectors.counting()));

        Map<Integer, Long> userCountMap = allUsers.stream()
                .filter(u -> u.getDepartment() != null)
                .collect(Collectors.groupingBy(u -> u.getDepartment().getId(), Collectors.counting()));

        return departments.stream().map(d -> DepartmentDTO.builder()
                .id(d.getId())
                .code(d.getCode())
                .name(d.getName())
                .type(d.getType())
                .subjectCount(subjectCountMap.getOrDefault(d.getId(), 0L))
                .userCount(userCountMap.getOrDefault(d.getId(), 0L))
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public DepartmentDTO createDepartment(DepartmentRequest req) {
        String code = req.getCode().trim().toUpperCase();
        if (departmentRepository.findByCode(code).isPresent()) {
            throw new IllegalArgumentException("Mã đơn vị / khoa '" + code + "' đã tồn tại!");
        }
        Department dept = Department.builder()
                .code(code)
                .name(req.getName().trim())
                .type(req.getType() != null && !req.getType().isBlank() ? req.getType().trim().toUpperCase() : "KHOA")
                .build();
        dept = departmentRepository.save(dept);
        return DepartmentDTO.builder()
                .id(dept.getId())
                .code(dept.getCode())
                .name(dept.getName())
                .type(dept.getType())
                .subjectCount(0)
                .userCount(0)
                .build();
    }

    @Transactional
    public DepartmentDTO updateDepartment(Integer id, DepartmentRequest req) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị / khoa ID: " + id));
        dept.setName(req.getName().trim());
        if (req.getType() != null && !req.getType().isBlank()) {
            dept.setType(req.getType().trim().toUpperCase());
        }
        departmentRepository.save(dept);
        return DepartmentDTO.builder()
                .id(dept.getId())
                .code(dept.getCode())
                .name(dept.getName())
                .type(dept.getType())
                .build();
    }

    @Transactional
    public void deleteDepartment(Integer id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị / khoa ID: " + id));
        // Reset users and subjects belonging to this department
        List<User> users = userRepository.findByDepartmentId(id);
        for (User u : users) {
            u.setDepartment(null);
            userRepository.save(u);
        }
        departmentRepository.delete(dept);
    }

    public List<SubjectSimpleDTO> getSubjectsByDepartment(Integer deptId) {
        List<Subject> subjects = subjectRepository.findByDepartmentIdOrderByCode(deptId);
        return subjects.stream().map(s -> SubjectSimpleDTO.builder()
                .id(s.getId())
                .code(s.getCode())
                .name(s.getName())
                .credits(s.getCredits())
                .departmentId(deptId)
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : "")
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public void assignSubjectToDepartment(Integer deptId, Integer subjectId) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khoa/đơn vị"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));
        subject.setDepartment(dept);
        subjectRepository.save(subject);
    }

    public List<UserManagementDTO> getAllUsers() {
        List<User> users = userRepository.findAllByOrderByFullNameAsc();
        return users.stream().map(this::mapToUserManagementDTO).collect(Collectors.toList());
    }

    public List<UserManagementDTO> getTeachersByDepartment(Integer deptId) {
        List<User> users = userRepository.findByDepartmentId(deptId);
        return users.stream().map(this::mapToUserManagementDTO).collect(Collectors.toList());
    }

    @Transactional
    public void assignSubjectsToTeacher(Long teacherId, List<Integer> subjectIds) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giáo viên ID: " + teacherId));

        teacherSubjectRepository.deleteByTeacherId(teacherId);

        if (subjectIds != null && !subjectIds.isEmpty()) {
            for (Integer subId : subjectIds) {
                Subject subject = subjectRepository.findById(subId).orElse(null);
                if (subject != null) {
                    TeacherSubject ts = TeacherSubject.builder()
                            .teacher(teacher)
                            .subject(subject)
                            .build();
                    teacherSubjectRepository.save(ts);
                }
            }
        }
    }

    public List<Integer> getAssignedSubjectIdsForTeacher(Long teacherId) {
        return teacherSubjectRepository.findByTeacherId(teacherId).stream()
                .map(ts -> ts.getSubject().getId())
                .collect(Collectors.toList());
    }

    @Transactional
    public UserManagementDTO createUser(UserCreateRequest req) {
        String cleanUsername = req.getUsername().trim().toLowerCase();
        if (userRepository.existsByUsername(cleanUsername)) {
            throw new IllegalArgumentException("Tên đăng nhập '" + cleanUsername + "' đã tồn tại!");
        }

        String roleCode = req.getRoleCode() != null && !req.getRoleCode().isBlank() ? req.getRoleCode() : "ROLE_GIANGVIEN";
        Role role = roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new IllegalArgumentException("Vai trò '" + roleCode + "' không tồn tại!"));

        Department dept = null;
        if (req.getDepartmentId() != null) {
            dept = departmentRepository.findById(req.getDepartmentId()).orElse(null);
        }

        User user = User.builder()
                .username(cleanUsername)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .email(req.getEmail() != null && !req.getEmail().isBlank() ? req.getEmail().trim() : null)
                .role(role)
                .department(dept)
                .isActive(true)
                .build();

        user = userRepository.save(user);
        return mapToUserManagementDTO(user);
    }

    @Transactional
    public UserManagementDTO updateUser(Long userId, UserUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng ID: " + userId));

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName().trim());
        }
        if (req.getEmail() != null) {
            user.setEmail(req.getEmail().trim());
        }
        if (req.getRoleCode() != null && !req.getRoleCode().isBlank()) {
            Role role = roleRepository.findByCode(req.getRoleCode())
                    .orElseThrow(() -> new IllegalArgumentException("Vai trò không hợp lệ: " + req.getRoleCode()));
            user.setRole(role);
        }
        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId()).orElse(null);
            user.setDepartment(dept);
        }
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getNewPassword().trim()));
        }

        user = userRepository.save(user);
        return mapToUserManagementDTO(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        teacherSubjectRepository.deleteByTeacherId(userId);
        userRepository.deleteById(userId);
    }

    private UserManagementDTO mapToUserManagementDTO(User u) {
        List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacherId(u.getId());
        List<SubjectSimpleDTO> assigned = teacherSubjects.stream().map(ts -> SubjectSimpleDTO.builder()
                .id(ts.getSubject().getId())
                .code(ts.getSubject().getCode())
                .name(ts.getSubject().getName())
                .credits(ts.getSubject().getCredits())
                .departmentId(ts.getSubject().getDepartment() != null ? ts.getSubject().getDepartment().getId() : null)
                .departmentName(ts.getSubject().getDepartment() != null ? ts.getSubject().getDepartment().getName() : "")
                .build()).collect(Collectors.toList());

        return UserManagementDTO.builder()
                .id(u.getId())
                .username(u.getUsername())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .roleCode(u.getRole() != null ? u.getRole().getCode() : "")
                .roleName(u.getRole() != null ? u.getRole().getName() : "")
                .departmentId(u.getDepartment() != null ? u.getDepartment().getId() : null)
                .departmentName(u.getDepartment() != null ? u.getDepartment().getName() : "Chưa phân công")
                .departmentType(u.getDepartment() != null ? u.getDepartment().getType() : "")
                .isActive(u.getIsActive())
                .assignedSubjects(assigned)
                .build();
    }
}
