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

        // Đồng bộ sequence tự tăng (PostgreSQL auto-increment sequence sync)
        syncPostgresSequences();
    }

    private void syncPostgresSequences() {
        String[] tables = {"students", "users", "classes", "subjects", "grades", "student_evaluations"};
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
