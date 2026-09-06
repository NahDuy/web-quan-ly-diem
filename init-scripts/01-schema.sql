-- Extension cho PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng Vai trò (Roles)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- 2. Bảng Phòng ban / Đơn vị (Departments)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL -- KHOA_DAO_TAO, TIEN_DOAN, DAI_DOI, PHONG_BAN
);

-- 3. Bảng Người dùng (Users)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role_id INT NOT NULL REFERENCES roles(id),
    department_id INT REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Khóa học (Courses)
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    start_year INT NOT NULL,
    end_year INT NOT NULL
);

-- 5. Bảng Ngành học (Majors)
CREATE TABLE majors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    department_id INT REFERENCES departments(id)
);

-- 6. Bảng Lớp học (Classes)
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    major_id INT NOT NULL REFERENCES majors(id),
    course_id INT NOT NULL REFERENCES courses(id),
    advisor_id BIGINT REFERENCES users(id)
);

-- 7. Bảng Học viên (Students)
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    student_code VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    pob VARCHAR(150),
    gender VARCHAR(10),
    class_id INT NOT NULL REFERENCES classes(id),
    user_id BIGINT UNIQUE REFERENCES users(id),
    status VARCHAR(30) DEFAULT 'DANG_HOC' -- DANG_HOC, TOT_NGHIEP, THOI_HOC
);

-- 8. Bảng Môn học (Subjects)
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    credits INT NOT NULL CHECK (credits > 0),
    department_id INT NOT NULL REFERENCES departments(id)
);

-- 9. Bảng Điểm số Môn học (Grades)
CREATE TABLE grades (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id),
    class_id INT NOT NULL REFERENCES classes(id),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
    score NUMERIC(4, 2) CHECK (score IS NULL OR (score >= 0 AND score <= 10)),
    status VARCHAR(20) DEFAULT 'PENDING',
    updated_by BIGINT REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_subject_class UNIQUE (student_id, subject_id, class_id)
);

-- 10. Bảng Đánh giá & Thi Tốt nghiệp (Student Evaluations)
CREATE TABLE student_evaluations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    class_id INT NOT NULL REFERENCES classes(id),
    conduct_grade VARCHAR(20) DEFAULT 'KHA', -- TOT, KHA, TRUNG_BINH, KEM
    score_political NUMERIC(4, 2) CHECK (score_political IS NULL OR (score_political >= 0 AND score_political <= 10)), -- Môn 1: Thi Chính trị
    score_military NUMERIC(4, 2) CHECK (score_military IS NULL OR (score_military >= 0 AND score_military <= 10)),  -- Môn 2: Thi Quân sự chung
    score_specialty NUMERIC(4, 2) CHECK (score_specialty IS NULL OR (score_specialty >= 0 AND score_specialty <= 10)), -- Môn 3: Thi Chuyên ngành
    tbc_grad_exam NUMERIC(4, 2), -- Điểm TN = (Môn1 + Môn2 + Môn3) / 3
    final_graduation_score NUMERIC(4, 2), -- Điểm Tốt Nghiệp = (TB*1 + Điểm TN*2) / 3
    graduation_classification VARCHAR(30) DEFAULT 'CHUA_XET', -- XUAT_SAC, GIOI, KHA, TRUNG_BINH, KHONG_DAT
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Bảng Khóa Bảng Điểm (Grade Locks)
CREATE TABLE grade_locks (
    id SERIAL PRIMARY KEY,
    class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    semester INT NOT NULL DEFAULT 1,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_by BIGINT REFERENCES users(id),
    unlocked_at TIMESTAMP WITH TIME ZONE,
    unlocked_by BIGINT REFERENCES users(id),
    CONSTRAINT uk_class_subject_semester UNIQUE (class_id, subject_id, semester)
);

-- 12. Bảng Khung chương trình đào tạo (Curriculums)
CREATE TABLE curriculums (
    id SERIAL PRIMARY KEY,
    major_id INT NOT NULL REFERENCES majors(id),
    course_id INT NOT NULL REFERENCES courses(id),
    name VARCHAR(200) NOT NULL,
    total_credits INT NOT NULL DEFAULT 0,
    file_path VARCHAR(255),
    file_name VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_major_course UNIQUE (major_id, course_id)
);

-- 13. Bảng Chi tiết Môn trong Khung (Curriculum Subjects)
CREATE TABLE curriculum_subjects (
    id SERIAL PRIMARY KEY,
    curriculum_id INT NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
    is_compulsory BOOLEAN DEFAULT TRUE,
    CONSTRAINT uk_curriculum_subject UNIQUE (curriculum_id, subject_id)
);

-- 14. Bảng Kiểm toán Chỉnh sửa Điểm & Mệnh lệnh (Grade Audit Logs)
CREATE TABLE grade_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    grade_id BIGINT REFERENCES grades(id) ON DELETE SET NULL,
    student_id BIGINT REFERENCES students(id),
    subject_id INT REFERENCES subjects(id),
    class_id INT NOT NULL REFERENCES classes(id),
    old_value NUMERIC(4, 2),
    new_value NUMERIC(4, 2),
    reason TEXT NOT NULL,
    modified_by BIGINT NOT NULL REFERENCES users(id),
    modified_by_username VARCHAR(50) NOT NULL,
    modified_by_role VARCHAR(50) NOT NULL,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    metadata JSONB
);

-- 15. Bảng Môn học áp dụng cho Lớp (Class Subjects - Cột linh hoạt)
CREATE TABLE class_subjects (
    id SERIAL PRIMARY KEY,
    class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
    is_extra BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 1,
    weight NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_class_subject_semester_mapping UNIQUE (class_id, subject_id, semester)
);

-- INDEXES NÂNG CAO TỐI ƯU HÓA TRUY VẤN MA TRẬN ĐIỂM
CREATE INDEX idx_grades_class_semester ON grades(class_id, semester);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_students_class_code ON students(class_id, student_code);
CREATE INDEX idx_evaluations_student ON student_evaluations(student_id);
CREATE INDEX idx_grade_locks_class ON grade_locks(class_id, semester);
CREATE INDEX idx_audit_logs_class_subject ON grade_audit_logs(class_id, subject_id);
CREATE INDEX idx_audit_logs_modified_at ON grade_audit_logs(modified_at DESC);
CREATE INDEX idx_class_subjects_class ON class_subjects(class_id, semester);

