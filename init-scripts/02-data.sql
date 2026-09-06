-- 1. Insert Roles
INSERT INTO roles (id, code, name) VALUES
(1, 'ROLE_BGH', 'Ban Giám Hiệu & Phòng Đào Tạo'),
(2, 'ROLE_BOMON', 'Đơn vị / Bộ môn'),
(3, 'ROLE_GIANGVIEN', 'Khoa / Giảng viên / Cán bộ Huấn luyện'),
(4, 'ROLE_SINHVIEN', 'Học viên Sĩ quan Dự bị');

-- 2. Insert Departments
INSERT INTO departments (id, code, name, type) VALUES
(1, 'PDT', 'Phòng Đào Tạo', 'PHONG_DAO_TAO'),
(2, 'BM_HT', 'Bộ môn Binh chủng Hợp thành', 'BO_MON'),
(3, 'BM_PB', 'Bộ môn Binh chủng Pháo binh', 'BO_MON'),
(4, 'BM_TT', 'Bộ môn Thông tin Kỹ thuật', 'BO_MON');

-- 3. Insert Test Users (Password for all is 'password123': $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85nJ3q0/5E2f7Yg3.ZpKO)
INSERT INTO users (id, username, password_hash, full_name, email, role_id, department_id, is_active) VALUES
(1, 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85nJ3q0/5E2f7Yg3.ZpKO', 'Ban Giám Hiệu', 'bgh@intranet.edu.vn', 1, 1, TRUE),
(2, 'bomon_ht', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85nJ3q0/5E2f7Yg3.ZpKO', 'Trưởng Bộ Môn Hợp thành', 'bomon.ht@intranet.edu.vn', 2, 2, TRUE),
(3, 'giangvien_a', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85nJ3q0/5E2f7Yg3.ZpKO', 'ThS. Nguyễn Văn Giảng', 'giang.nv@intranet.edu.vn', 3, 2, TRUE),
(4, 'sv001', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85nJ3q0/5E2f7Yg3.ZpKO', 'Nguyễn Văn An', 'an.nv@student.edu.vn', 4, 2, TRUE);

-- 4. Insert Courses (Khóa Đào tạo SQDB theo năm)
INSERT INTO courses (id, code, name, start_year, end_year) VALUES
(1, 'SQDB2026', 'Khóa Đào tạo Sĩ quan Dự bị Năm 2026', 2026, 2026),
(2, 'SQDB2025', 'Khóa Đào tạo Sĩ quan Dự bị Năm 2025', 2025, 2025),
(3, 'SQDB2024', 'Khóa Đào tạo Sĩ quan Dự bị Năm 2024', 2024, 2024);

-- 5. Insert Majors (Chuyên ngành / Khóa Đào tạo)
INSERT INTO majors (id, code, name, department_id) VALUES
(1, 'HT', 'Binh chủng Hợp thành', 2),
(2, 'PB', 'Binh chủng Pháo binh', 3),
(3, 'TT', 'Thông tin Kỹ thuật', 4);

-- 6. Insert Classes (Lớp học theo Khóa SQDB)
INSERT INTO classes (id, code, name, major_id, course_id, advisor_id) VALUES
(1, 'SQDB2026-HT1', 'Lớp SQDB 2026 - Binh chủng Hợp thành 1', 1, 1, 3),
(2, 'SQDB2026-PB1', 'Lớp SQDB 2026 - Pháo binh 1', 2, 1, 3),
(3, 'SQDB2026-TT1', 'Lớp SQDB 2026 - Thông tin Kỹ thuật 1', 3, 1, 3),
(4, 'SQDB2025-HT1', 'Lớp SQDB 2025 - Binh chủng Hợp thành 1', 1, 2, 3),
(5, 'SQDB2024-HT1', 'Lớp SQDB 2024 - Binh chủng Hợp thành 1', 1, 3, 3);

-- 7. Insert Subjects
INSERT INTO subjects (id, code, name, credits, department_id) VALUES
(1, 'INT1001', 'Kiến trúc cơ sở TT HTD', 3, 2),
(2, 'INT1002', 'Lập trình C/C++ Nâng cao', 3, 2),
(3, 'INT1003', 'Cấu trúc dữ liệu & Giải thuật', 4, 2),
(4, 'INT1004', 'Cơ sở dữ liệu PostgreSQL', 3, 2);

-- 8. Insert Curriculum
INSERT INTO curriculums (id, major_id, course_id, name, total_credits) VALUES
(1, 1, 1, 'Chương trình Đào tạo SQDB2026 Binh chủng Hợp thành', 13);

INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory) VALUES
(1, 1, 1, TRUE),
(1, 2, 1, TRUE),
(1, 3, 1, TRUE),
(1, 4, 1, TRUE);

-- 9. Insert Students
INSERT INTO students (id, student_code, full_name, dob, pob, gender, class_id, user_id, status) VALUES
(1, 'HV2026001', 'Nguyễn Văn An', '2002-05-15', 'Hà Nội', 'Nam', 1, 4, 'DANG_HOC'),
(2, 'HV2026002', 'Trần Thị Bình', '2002-08-20', 'Hải Phòng', 'Nữ', 1, NULL, 'DANG_HOC'),
(3, 'HV2026003', 'Lê Hoàng Cường', '2002-11-10', 'Nam Định', 'Nam', 1, NULL, 'DANG_HOC'),
(4, 'HV2026004', 'Phạm Minh Đức', '2002-03-25', 'Thái Bình', 'Nam', 1, NULL, 'DANG_HOC'),
(5, 'HV2026005', 'Vũ Thị Hoa', '2002-12-05', 'Quảng Ninh', 'Nữ', 1, NULL, 'DANG_HOC');

-- 10. Insert Initial Grades for Semester 1
INSERT INTO grades (student_id, subject_id, class_id, semester, score, status, updated_by) VALUES
-- Student 1
(1, 1, 1, 1, 8.5, 'PASSED', 3),
(1, 2, 1, 1, 8.0, 'PASSED', 3),
(1, 3, 1, 1, 7.5, 'PASSED', 3),
(1, 4, 1, 1, 8.5, 'PASSED', 3),
-- Student 2
(2, 1, 1, 1, 6.5, 'PASSED', 3),
(2, 2, 1, 1, 7.0, 'PASSED', 3),
(2, 3, 1, 1, 6.0, 'PASSED', 3),
(2, 4, 1, 1, 6.5, 'PASSED', 3),
-- Student 3
(3, 1, 1, 1, 9.0, 'PASSED', 3),
(3, 2, 1, 1, 9.5, 'PASSED', 3),
(3, 3, 1, 1, 8.5, 'PASSED', 3),
(3, 4, 1, 1, 9.0, 'PASSED', 3),
-- Student 4
(4, 1, 1, 1, 5.0, 'PASSED', 3),
(4, 2, 1, 1, 5.5, 'PASSED', 3),
(4, 3, 1, 1, 4.5, 'FAILED', 3),
(4, 4, 1, 1, 5.0, 'PASSED', 3),
-- Student 5
(5, 1, 1, 1, 7.0, 'PASSED', 3),
(5, 2, 1, 1, 7.5, 'PASSED', 3),
(5, 3, 1, 1, 8.0, 'PASSED', 3),
(5, 4, 1, 1, 7.5, 'PASSED', 3);

-- 11. Insert Student Evaluations (Rèn luyện, 3 môn Thi tốt nghiệp)
INSERT INTO student_evaluations (student_id, class_id, conduct_grade, score_political, score_military, score_specialty, tbc_grad_exam, final_graduation_score, graduation_classification) VALUES
(1, 1, 'TOT', 8.5, 8.0, 9.0, 8.5, 8.36, 'GIOL'),
(2, 1, 'KHA', 6.5, 6.0, 7.0, 6.5, 6.49, 'TRUNG_BINH'),
(3, 1, 'XUAT_SAC', 9.0, 9.5, 8.5, 9.0, 8.99, 'GIOL'),
(4, 1, 'TRUNG_BINH', 5.0, 5.0, 5.0, 5.0, 4.99, 'KHONG_DAT'),
(5, 1, 'KHA', 7.5, 7.5, 7.5, 7.5, 7.51, 'KHA');
