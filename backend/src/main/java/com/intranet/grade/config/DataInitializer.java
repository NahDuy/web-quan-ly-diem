package com.intranet.grade.config;

import com.intranet.grade.entity.Department;
import com.intranet.grade.entity.Role;
import com.intranet.grade.entity.User;
import com.intranet.grade.repository.DepartmentRepository;
import com.intranet.grade.repository.RoleRepository;
import com.intranet.grade.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final com.intranet.grade.repository.MajorRepository majorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking & Initializing default security users...");

        Role roleBgh = roleRepository.findByCode("ROLE_BGH")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_BGH").name("Ban Giám Hiệu & Phòng Đào Tạo").build()));

        Role roleBomon = roleRepository.findByCode("ROLE_BOMON")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_BOMON").name("Đơn vị / Bộ môn").build()));

        Role roleGiangVien = roleRepository.findByCode("ROLE_GIANGVIEN")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_GIANGVIEN").name("Giáo viên / Cán bộ Huấn luyện").build()));

        Role roleSinhVien = roleRepository.findByCode("ROLE_SINHVIEN")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_SINHVIEN").name("Học viên Sĩ quan Dự bị").build()));

        Department pdt = departmentRepository.findByCode("PDT")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("PDT").name("Phòng Đào Tạo").type("PHONG_DAO_TAO").build()));

        String defaultPass = passwordEncoder.encode("password123");

        createOrUpdateUser("admin", defaultPass, "Đại tá Trần Văn Thủ (Ban Giám Hiệu)", "bgh@intranet.edu.vn", roleBgh, pdt);
        createOrUpdateUser("bomon_ht", defaultPass, "Thượng tá Lê Văn Bộ (Chủ nhiệm Bộ môn)", "bomon.ht@intranet.edu.vn", roleBomon, pdt);
        createOrUpdateUser("giangvien_a", defaultPass, "Thượng úy Nguyễn Văn Giảng (Giáo viên)", "giang.nv@intranet.edu.vn", roleGiangVien, pdt);
        createOrUpdateUser("sv001", defaultPass, "Thượng sĩ Nguyễn Văn An (Học viên)", "an.nv@student.edu.vn", roleSinhVien, pdt);

        log.info("Default security users initialized successfully! All users updated with password 'password123'.");

        // Khởi tạo danh mục chuyên ngành chuẩn quân sự
        initDefaultMajors(pdt);

        // Đồng bộ sequence tự tăng (PostgreSQL auto-increment sequence sync)
        syncPostgresSequences();
    }

    private void initDefaultMajors(Department defaultDept) {
        String[][] defaultMajors = {
            {"TSBB", "Trinh sát Bộ binh"},
            {"COI", "Súng Cối 82mm / 100mm"},
            {"DKZ", "Súng ĐKZ (82-K65, SPG-9)"},
            {"PK127", "Súng máy Phòng không 12,7mm"},
            {"BB", "Binh chủng Hợp thành (Bộ binh)"},
            {"PB", "Binh chủng Pháo binh"},
            {"TT", "Thông tin Kỹ thuật / Liên lạc"},
            {"CB", "Binh chủng Công binh"},
            {"TTG", "Binh chủng Tăng - Thiết giáp"},
            {"HH", "Binh chủng Phòng hóa"},
            {"HC", "Hậu cần Quân sự"},
            {"KT", "Kỹ thuật Quân khí"},
            {"QY", "Quân y"}
        };

        for (String[] item : defaultMajors) {
            String code = item[0];
            String name = item[1];
            if (majorRepository.findByCode(code).isEmpty()) {
                majorRepository.save(com.intranet.grade.entity.Major.builder()
                        .code(code)
                        .name(name)
                        .department(defaultDept)
                        .build());
                log.info("Initialized default military major: {} - {}", code, name);
            }
        }
    }

    private void syncPostgresSequences() {
        try {
            jdbcTemplate.execute("ALTER TABLE grade_audit_logs ALTER COLUMN metadata TYPE text;");
            log.info("Ensured grade_audit_logs.metadata is column type TEXT");
        } catch (Exception e) {
            log.debug("Metadata column check notice: {}", e.getMessage());
        }

        String[] tables = {
            "students", "users", "classes", "subjects", "grades", 
            "student_evaluations", "grade_audit_logs", "class_subjects",
            "courses", "majors", "departments", "roles", "curriculums", 
            "curriculum_subjects", "grade_locks"
        };
        for (String table : tables) {
            try {
                jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('" + table + "', 'id'), COALESCE((SELECT max(id) FROM " + table + "), 1));");
                log.info("Synchronized sequence for table: {}", table);
            } catch (Exception e) {
                log.warn("Sequence synchronization notice for {}: {}", table, e.getMessage());
            }
        }
    }

    private void createOrUpdateUser(String username, String passwordHash, String fullName, String email, Role role, Department dept) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            user = User.builder()
                    .username(username)
                    .passwordHash(passwordHash)
                    .fullName(fullName)
                    .email(email)
                    .role(role)
                    .department(dept)
                    .isActive(true)
                    .build();
        } else {
            user.setPasswordHash(passwordHash);
            user.setFullName(fullName);
            user.setRole(role);
            user.setDepartment(dept);
            user.setIsActive(true);
        }
        userRepository.save(user);
    }
}
