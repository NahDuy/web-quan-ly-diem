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
    private final com.intranet.grade.repository.TeacherSubjectRepository teacherSubjectRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking & Initializing default security users, roles, and departments...");

        Role roleBgh = roleRepository.findByCode("ROLE_BGH")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_BGH").name("Ban Giám Hiệu").build()));
        Role rolePdt = roleRepository.findByCode("ROLE_PDT")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_PDT").name("Phòng Đào Tạo").build()));
        Role roleTruongKhoa = roleRepository.findByCode("ROLE_TRUONGKHOA")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_TRUONGKHOA").name("Trưởng Khoa").build()));
        Role roleGiangVien = roleRepository.findByCode("ROLE_GIANGVIEN")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_GIANGVIEN").name("Giáo viên bộ môn").build()));
        Role roleDonVi = roleRepository.findByCode("ROLE_DONVI")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_DONVI").name("Đơn vị Quản lý Học viên").build()));
        Role roleBomon = roleRepository.findByCode("ROLE_BOMON")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_BOMON").name("Đơn vị / Bộ môn").build()));
        Role roleSinhVien = roleRepository.findByCode("ROLE_SINHVIEN")
                .orElseGet(() -> roleRepository.save(Role.builder().code("ROLE_SINHVIEN").name("Học viên Sĩ quan Dự bị").build()));

        Department bghDept = departmentRepository.findByCode("BGH")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("BGH").name("Ban Giám Hiệu").type("PHONG_BAN").build()));
        Department pdtDept = departmentRepository.findByCode("PDT")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("PDT").name("Phòng Đào Tạo").type("PHONG_BAN").build()));
        Department khoaBc = departmentRepository.findByCode("KHOA_BC")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("KHOA_BC").name("Khoa Binh chủng Hợp thành").type("KHOA").build()));
        Department khoaQs = departmentRepository.findByCode("KHOA_QS")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("KHOA_QS").name("Khoa Quân sự chung").type("KHOA").build()));
        Department khoaCt = departmentRepository.findByCode("KHOA_CT")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("KHOA_CT").name("Khoa CTĐ - CTCT (Chính trị)").type("KHOA").build()));
        Department donviD1 = departmentRepository.findByCode("D1")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("D1").name("Tiểu đoàn 1 - Quản lý Học viên").type("DON_VI").build()));
        Department donviD2 = departmentRepository.findByCode("D2")
                .orElseGet(() -> departmentRepository.save(Department.builder().code("D2").name("Tiểu đoàn 2 - Quản lý Học viên").type("DON_VI").build()));

        // Khởi tạo 5 tài khoản test tương ứng với 5 role: username = password
        createOrUpdateUser("bgh", passwordEncoder.encode("bgh"), "Thiếu tướng Trần Quốc Tuấn (Ban Giám Hiệu)", "bgh@intranet.edu.vn", roleBgh, bghDept);
        createOrUpdateUser("pdt", passwordEncoder.encode("pdt"), "Đại tá Nguyễn Đức Phòng (Trưởng Phòng Đào Tạo)", "pdt@intranet.edu.vn", rolePdt, pdtDept);
        createOrUpdateUser("truongkhoa", passwordEncoder.encode("truongkhoa"), "Thượng tá Lê Đình Khoa (Trưởng Khoa Binh chủng Hợp thành)", "truongkhoa@intranet.edu.vn", roleTruongKhoa, khoaBc);
        createOrUpdateUser("giaovien", passwordEncoder.encode("giaovien"), "Đại úy Hoàng Văn Giáo (Giáo viên Bộ môn)", "giaovien@intranet.edu.vn", roleGiangVien, khoaBc);
        createOrUpdateUser("donvi", passwordEncoder.encode("donvi"), "Trung tá Đặng Văn Đơn (Chỉ huy Đơn vị QLHV Tiểu đoàn 1)", "donvi@intranet.edu.vn", roleDonVi, donviD1);

        // Giữ tài khoản quản trị cũ
        createOrUpdateUser("admin", passwordEncoder.encode("password123"), "Đại tá Trần Văn Thủ (Ban Giám Hiệu)", "admin@intranet.edu.vn", roleBgh, pdtDept);
        createOrUpdateUser("bomon_ht", passwordEncoder.encode("password123"), "Thượng tá Lê Văn Bộ (Chủ nhiệm Bộ môn)", "bomon.ht@intranet.edu.vn", roleBomon, khoaBc);
        createOrUpdateUser("giangvien_a", passwordEncoder.encode("password123"), "Thượng úy Nguyễn Văn Giảng (Giáo viên)", "giang.nv@intranet.edu.vn", roleGiangVien, khoaBc);
        createOrUpdateUser("sv001", passwordEncoder.encode("password123"), "Thượng sĩ Nguyễn Văn An (Học viên)", "an.nv@student.edu.vn", roleSinhVien, donviD1);

        log.info("5 core security roles & accounts initialized successfully!");

        // Khởi tạo danh mục chuyên ngành chuẩn quân sự
        initDefaultMajors(pdtDept);

        // Khởi tạo môn học quân sự và Lộ trình đào tạo chuẩn theo chuyên ngành
        initMilitarySubjectsAndCurriculums(khoaBc);

        // Phân công môn giảng dạy cho tài khoản giáo viên test
        assignDefaultSubjectsToTeacher();

        // Đồng bộ sequence tự tăng (PostgreSQL auto-increment sequence sync)
        syncPostgresSequences();
    }

    private void assignDefaultSubjectsToTeacher() {
        try {
            userRepository.findByUsername("giaovien").ifPresent(gv -> {
                List<String> codes = List.of("BB101", "QS103", "TS101");
                for (String code : codes) {
                    subjectRepository.findByCode(code).ifPresent(sub -> {
                        if (!teacherSubjectRepository.existsByTeacherIdAndSubjectId(gv.getId(), sub.getId())) {
                            teacherSubjectRepository.save(com.intranet.grade.entity.TeacherSubject.builder()
                                    .teacher(gv)
                                    .subject(sub)
                                    .build());
                            log.info("Assigned subject {} to test teacher 'giaovien'", sub.getCode());
                        }
                    });
                }
            });
            userRepository.findByUsername("giangvien_a").ifPresent(gv -> {
                List<String> codes = List.of("BB101", "QS101", "QS103");
                for (String code : codes) {
                    subjectRepository.findByCode(code).ifPresent(sub -> {
                        if (!teacherSubjectRepository.existsByTeacherIdAndSubjectId(gv.getId(), sub.getId())) {
                            teacherSubjectRepository.save(com.intranet.grade.entity.TeacherSubject.builder()
                                    .teacher(gv)
                                    .subject(sub)
                                    .build());
                        }
                    });
                }
            });
        } catch (Exception e) {
            log.warn("Notice assigning default subjects to teacher: {}", e.getMessage());
        }
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
            user.setEmail(email);
            user.setRole(role);
            user.setDepartment(dept);
            user.setIsActive(true);
        }
        try {
            userRepository.save(user);
        } catch (Exception e) {
            log.warn("Notice saving user {} with email {}: {}, retrying without email", username, email, e.getMessage());
            user.setEmail(null);
            userRepository.save(user);
        }
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
