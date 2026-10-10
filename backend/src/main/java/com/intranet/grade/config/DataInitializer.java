package com.intranet.grade.config;

import com.intranet.grade.entity.*;
import com.intranet.grade.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final MajorRepository majorRepository;
    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;
    private final CurriculumRepository curriculumRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;
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

        // Khởi tạo môn học quân sự và Lộ trình đào tạo chuẩn theo chuyên ngành
        initMilitarySubjectsAndCurriculums(pdt);

        // Đồng bộ sequence tự tăng (PostgreSQL auto-increment sequence sync)
        syncPostgresSequences();
    }

    private void initDefaultMajors(Department defaultDept) {
        String[][] defaultMajors = {
            {"TSBB", "Trinh sát Bộ binh"},
            {"DL", "Khẩu đội trưởng Đại liên"},
            {"C60", "Súng Cối 60mm"},
            {"COI", "Súng Cối 82mm"},
            {"C100", "Súng Cối 100mm"},
            {"DKZ", "Súng ĐKZ 82-K65"},
            {"SPG9", "Khẩu đội trưởng ĐKZ SPG-9"},
            {"AGS17", "Súng phóng lựu AGS-17"},
            {"PK127", "Súng máy Phòng không 12,7mm"},
            {"PK37", "Khẩu đội trưởng PPK 37mm"},
            {"PK57", "Khẩu đội trưởng PPK 57mm"},
            {"PXK", "Khẩu đội trưởng Pháo xe kéo"},
            {"KTPB", "Tiểu đội trưởng Kế toán Pháo binh"},
            {"VTD", "Tiểu đội trưởng Vô tuyến điện"},
            {"HTD", "Tiểu đội trưởng Hữu tuyến điện"},
            {"BVU", "Nhân viên Báo vụ"},
            {"NVQY", "Nhân viên Quân y Đại đội"},
            {"NVBQVK", "Nhân viên Bảo quản Vũ khí"},
            {"NVBQD", "Nhân viên Bảo quản Đạn"},
            {"NA", "Tiểu đội trưởng Nấu ăn"},
            {"CB", "Công binh công trình"},
            {"BB", "Binh chủng Hợp thành (Bộ binh)"},
            {"BCHT", "Binh chủng Hợp thành"},
            {"PB", "Binh chủng Pháo binh"},
            {"TT", "Thông tin Kỹ thuật / Liên lạc"},
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

    public void syncPostgresSequences() {
        try {
            jdbcTemplate.execute("ALTER TABLE grade_audit_logs ALTER COLUMN metadata TYPE text;");
            jdbcTemplate.execute("UPDATE majors SET name = 'Binh chủng Hợp thành' WHERE (code = 'BCHT' OR code = 'HT') AND (name LIKE '%ß%' OR name LIKE '%╗%');");
            log.info("Ensured grade_audit_logs.metadata is column type TEXT and sanitized majors");
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

    private void initMilitarySubjectsAndCurriculums(Department defaultDept) {
        // 1. Get or Create Course SQDB2026
        Course course = courseRepository.findByCode("SQDB2026").orElseGet(() ->
                courseRepository.save(Course.builder()
                        .code("SQDB2026")
                        .name("Khóa Đào tạo Sĩ quan Dự bị Năm 2026")
                        .startYear(2026)
                        .endYear(2026)
                        .build())
        );

        // 2. Foundation Subjects
        Subject qs101 = getOrCreateSubject("QS101", "Giáo dục Chính trị Quân sự", 2, defaultDept);
        Subject qs102 = getOrCreateSubject("QS102", "Điều lệnh Đội ngũ & Quản lý Bộ đội", 2, defaultDept);
        Subject qs103 = getOrCreateSubject("QS103", "Bắn súng Quân dụng (K54 / Tiểu liên AK)", 3, defaultDept);
        Subject qs104 = getOrCreateSubject("QS104", "Chiến thuật Từng người & Tổ Bộ binh", 3, defaultDept);
        Subject qs105 = getOrCreateSubject("QS105", "Thể lực & Võ thuật Quân sự", 2, defaultDept);
        Subject qs106 = getOrCreateSubject("QS106", "Công sự Ngụy trang & Địa hình Quân sự", 2, defaultDept);

        // 3. Specialized Subjects
        Subject ts101 = getOrCreateSubject("TS101", "Kỹ thuật & Chiến thuật Trinh sát Đặc nhiệm", 4, defaultDept);
        Subject ts102 = getOrCreateSubject("TS102", "Võ thuật Chiến đấu & Bắt bắt địch", 3, defaultDept);
        Subject ts103 = getOrCreateSubject("TS103", "Trinh sát Đêm & Khí tài Quan sát", 3, defaultDept);

        Subject coi101 = getOrCreateSubject("COI101", "Cấu tạo & Quy tắc bắn Súng Cối 82mm", 4, defaultDept);
        Subject coi102 = getOrCreateSubject("COI102", "Khí tài Đo đạc & Tính toán Phần tử bắn", 3, defaultDept);
        Subject coi103 = getOrCreateSubject("COI103", "Chiến thuật Trung đội Hỏa lực Cối", 3, defaultDept);

        Subject dkz101 = getOrCreateSubject("DKZ101", "Cấu tạo & Quy tắc bắn ĐKZ (82-K65, SPG-9)", 4, defaultDept);
        Subject dkz102 = getOrCreateSubject("DKZ102", "Chiến thuật Phục kích Diệt tăng ĐKZ", 3, defaultDept);
        Subject dkz103 = getOrCreateSubject("DKZ103", "Kỹ thuật Hiệu chỉnh & Ngắm bắn ĐKZ", 3, defaultDept);

        Subject pk101 = getOrCreateSubject("PK101", "Cấu tạo SMPK 12,7mm & Quy tắc bắn", 4, defaultDept);
        Subject pk102 = getOrCreateSubject("PK102", "Bắn Mục tiêu Bay thấp & Mặt đất", 3, defaultDept);
        Subject pk103 = getOrCreateSubject("PK103", "Chiến thuật Phân đội SMPK 12,7mm", 3, defaultDept);

        Subject bb101 = getOrCreateSubject("BB101", "Chiến thuật Trung đội Bộ binh Tiến công & Phòng ngự", 4, defaultDept);
        Subject bb102 = getOrCreateSubject("BB102", "Sử dụng Hỏa lực Bộ binh (B40, B41, RPD)", 3, defaultDept);
        Subject bb103 = getOrCreateSubject("BB103", "Tổ chức Chỉ huy Phân đội Bộ binh", 3, defaultDept);

        Subject pb101 = getOrCreateSubject("PB101", "Lý thuyết & Quy tắc bắn Pháo binh", 4, defaultDept);
        Subject pb102 = getOrCreateSubject("PB102", "Chỉ huy Hỏa lực & Đo đạc Trinh sát Pháo", 4, defaultDept);

        Subject tt101 = getOrCreateSubject("TT101", "Khí tài Vô tuyến điện Quân sự", 3, defaultDept);
        Subject tt102 = getOrCreateSubject("TT102", "Mạng Thông tin Chỉ huy Tác chiến", 4, defaultDept);

        // 4. Curriculums by Major
        initCurriculumForMajor("TSBB", "Lộ trình Đào tạo SQDB Trinh sát Bộ binh", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, ts101, ts102, ts103));
        initCurriculumForMajor("COI", "Lộ trình Đào tạo SQDB Súng Cối 82mm", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, coi101, coi102, coi103));
        initCurriculumForMajor("DKZ", "Lộ trình Đào tạo SQDB Súng ĐKZ", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, dkz101, dkz102, dkz103));
        initCurriculumForMajor("PK127", "Lộ trình Đào tạo SQDB Súng máy Phòng không 12,7mm", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, pk101, pk102, pk103));
        initCurriculumForMajor("BB", "Lộ trình Đào tạo SQDB Bộ binh", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, bb101, bb102, bb103));
        initCurriculumForMajor("BCHT", "Lộ trình Đào tạo SQDB Binh chủng Hợp thành", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, bb101, bb102, bb103));
        initCurriculumForMajor("HT", "Lộ trình Đào tạo SQDB Hợp thành", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, bb101, bb102, bb103));
        initCurriculumForMajor("PB", "Lộ trình Đào tạo SQDB Pháo binh", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, pb101, pb102));
        initCurriculumForMajor("TT", "Lộ trình Đào tạo SQDB Thông tin Kỹ thuật", course, List.of(qs101, qs102, qs103, qs104, qs105, qs106, tt101, tt102));

        // 5. Khởi tạo Lộ trình Đào tạo riêng biệt cho các Khóa trước (Khóa 2025, Khóa 2024)
        Course course2025 = courseRepository.findByCode("SQDB2025").orElseGet(() ->
                courseRepository.save(Course.builder()
                        .code("SQDB2025")
                        .name("Khóa Đào tạo Sĩ quan Dự bị Năm 2025")
                        .startYear(2025)
                        .endYear(2025)
                        .build())
        );

        Course course2024 = courseRepository.findByCode("SQDB2024").orElseGet(() ->
                courseRepository.save(Course.builder()
                        .code("SQDB2024")
                        .name("Khóa Đào tạo Sĩ quan Dự bị Năm 2024")
                        .startYear(2024)
                        .endYear(2024)
                        .build())
        );

        initCurriculumForMajor("TSBB", "Lộ trình Đào tạo SQDB Trinh sát Bộ binh (Khóa 2025)", course2025, List.of(qs101, qs102, qs103, qs104, qs105, ts101, ts102, ts103));
        initCurriculumForMajor("BB", "Lộ trình Đào tạo SQDB Bộ binh (Khóa 2025)", course2025, List.of(qs101, qs102, qs103, qs104, qs105, bb101, bb102, bb103));
        initCurriculumForMajor("BCHT", "Lộ trình Đào tạo SQDB Binh chủng Hợp thành (Khóa 2025)", course2025, List.of(qs101, qs102, qs103, qs104, qs105, bb101, bb102, bb103));
        initCurriculumForMajor("COI", "Lộ trình Đào tạo SQDB Súng Cối 82mm (Khóa 2025)", course2025, List.of(qs101, qs102, qs103, qs104, qs105, coi101, coi102, coi103));
        initCurriculumForMajor("DKZ", "Lộ trình Đào tạo SQDB Súng ĐKZ (Khóa 2025)", course2025, List.of(qs101, qs102, qs103, qs104, qs105, dkz101, dkz102, dkz103));

        initCurriculumForMajor("TSBB", "Lộ trình Đào tạo SQDB Trinh sát Bộ binh (Khóa 2024)", course2024, List.of(qs101, qs102, qs103, qs104, ts101, ts102, ts103));
        initCurriculumForMajor("BB", "Lộ trình Đào tạo SQDB Bộ binh (Khóa 2024)", course2024, List.of(qs101, qs102, qs103, qs104, bb101, bb102, bb103));
        initCurriculumForMajor("BCHT", "Lộ trình Đào tạo SQDB Binh chủng Hợp thành (Khóa 2024)", course2024, List.of(qs101, qs102, qs103, qs104, bb101, bb102, bb103));
    }

    private Subject getOrCreateSubject(String code, String name, int credits, Department dept) {
        return subjectRepository.findByCode(code).orElseGet(() ->
                subjectRepository.save(Subject.builder()
                        .code(code)
                        .name(name)
                        .credits(credits)
                        .department(dept)
                        .build())
        );
    }

    private void initCurriculumForMajor(String majorCode, String currName, Course course, List<Subject> subjects) {
        Major major = majorRepository.findByCode(majorCode).orElse(null);
        if (major == null) return;

        Curriculum curr = curriculumRepository.findByMajorIdAndCourseId(major.getId(), course.getId()).orElse(null);
        if (curr == null) {
            int totalCredits = subjects.stream().mapToInt(Subject::getCredits).sum();
            curr = curriculumRepository.save(Curriculum.builder()
                    .major(major)
                    .course(course)
                    .name(currName)
                    .totalCredits(totalCredits)
                    .build());
            log.info("Initialized curriculum for major: {} - {}", majorCode, currName);

            int order = 1;
            for (Subject s : subjects) {
                curriculumSubjectRepository.save(CurriculumSubject.builder()
                        .curriculum(curr)
                        .subject(s)
                        .semester(1)
                        .isCompulsory(true)
                        .build());
            }
        }
    }
}
