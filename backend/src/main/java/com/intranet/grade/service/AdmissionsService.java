package com.intranet.grade.service;

import com.intranet.grade.config.DataInitializer;
import com.intranet.grade.dto.AdmissionsExecuteRequest;
import com.intranet.grade.dto.AdmissionsPreviewResponse;
import com.intranet.grade.dto.ParsedSectionDTO;
import com.intranet.grade.dto.ParsedStudentDTO;
import com.intranet.grade.entity.*;
import com.intranet.grade.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdmissionsService {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final MajorRepository majorRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentEvaluationRepository evaluationRepository;
    private final DataInitializer dataInitializer;

    public AdmissionsPreviewResponse previewAdmissionsFile(MultipartFile file, String targetTypeOverride, Integer yearOverride, String classNamingMode) throws Exception {
        int year = (yearOverride != null && yearOverride > 2000) ? yearOverride : 2026;
        String yearShort = String.valueOf(year).substring(2);

        List<ParsedSectionDTO> sections = new ArrayList<>();
        int totalStudents = 0;

        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            String currentTitle = "";
            String currentKhoa = "";
            String currentMajorText = "";
            String currentDetectedTarget = detectTargetTypeFromText("", targetTypeOverride);
            String currentTargetName = getTargetName(currentDetectedTarget);

            List<ParsedStudentDTO> currentStudents = new ArrayList<>();
            Map<String, Integer> classCounter = new HashMap<>();
            Map<String, Integer> studentCounter = new HashMap<>();

            for (int r = 0; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                String rowText = getRowFullText(row);

                // Detect Section Header: "Khóa..." or "DANH SÁCH..." or "Đào tạo..."
                if (rowText.contains("Khóa") || rowText.contains("Đào tạo")) {
                    if (rowText.toLowerCase().contains("khóa") || rowText.toLowerCase().contains("sĩ quan dự bị")) {
                        if (!currentStudents.isEmpty() && !currentMajorText.isEmpty()) {
                            ParsedSectionDTO sec = buildSectionDTO(currentTitle, currentKhoa, currentMajorText, currentDetectedTarget, currentTargetName, year, yearShort, classNamingMode, currentStudents, classCounter, studentCounter);
                            sections.add(sec);
                            totalStudents += currentStudents.size();
                            currentStudents = new ArrayList<>();
                            currentMajorText = "";
                        }
                    }
                    if (rowText.contains("Khóa")) {
                        currentKhoa = extractKhoaText(rowText);
                    }
                    currentDetectedTarget = detectTargetTypeFromText(rowText, targetTypeOverride);
                    currentTargetName = getTargetName(currentDetectedTarget);
                }

                if (rowText.contains("Chuyên ngành:")) {
                    // If we previously accumulated students for another major within the same section
                    if (!currentStudents.isEmpty() && !currentMajorText.isEmpty()) {
                        ParsedSectionDTO sec = buildSectionDTO(currentTitle, currentKhoa, currentMajorText, currentDetectedTarget, currentTargetName, year, yearShort, classNamingMode, currentStudents, classCounter, studentCounter);
                        sections.add(sec);
                        totalStudents += currentStudents.size();
                        currentStudents = new ArrayList<>();
                    }
                    currentMajorText = extractMajorText(rowText);
                }

                // Check for student data row: cell 0 is numeric STT, cell 1 has name
                Cell c0 = row.getCell(0);
                Cell c1 = row.getCell(1);

                if (c0 != null && c1 != null) {
                    Integer stt = parseNumericCell(c0);
                    String name = getCellString(c1).trim();

                    if (stt != null && !name.isBlank() && !name.contains("Họ và tên") && !name.contains("Chỉ tiêu") && !name.contains("Tổng") && !name.equalsIgnoreCase("TQSQK3")) {
                        String dob = row.getCell(2) != null ? getCellString(row.getCell(2)).trim() : "";
                        String pob = row.getCell(3) != null ? getCellString(row.getCell(3)).trim() : "";
                        String gender = row.getCell(4) != null ? getCellString(row.getCell(4)).trim() : "Nam";
                        String ethnic = row.getCell(5) != null ? getCellString(row.getCell(5)).trim() : "Kinh";
                        String unit = row.getCell(6) != null ? getCellString(row.getCell(6)).trim() : "";

                        currentStudents.add(ParsedStudentDTO.builder()
                                .stt(stt)
                                .fullName(name)
                                .dob(dob)
                                .pob(pob)
                                .gender(gender)
                                .ethnic(ethnic)
                                .unit(unit)
                                .build());
                    }
                }
            }

            // Flush last section if any
            if (!currentStudents.isEmpty() && !currentMajorText.isEmpty()) {
                ParsedSectionDTO sec = buildSectionDTO(currentTitle, currentKhoa, currentMajorText, currentDetectedTarget, currentTargetName, year, yearShort, classNamingMode, currentStudents, classCounter, studentCounter);
                sections.add(sec);
                totalStudents += currentStudents.size();
            }
        }

        return AdmissionsPreviewResponse.builder()
                .fileName(file.getOriginalFilename())
                .totalSections(sections.size())
                .totalStudents(totalStudents)
                .academicYear(year)
                .defaultTargetType(targetTypeOverride != null ? targetTypeOverride : "AUTO")
                .sections(sections)
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> executeAdmissionsImport(AdmissionsExecuteRequest req) {
        int year = req.getAcademicYear() != null ? req.getAcademicYear() : 2026;
        int totalSaved = 0;
        List<String> createdClasses = new ArrayList<>();

        Department defaultDept = departmentRepository.findAll().stream().findFirst().orElse(null);

        for (ParsedSectionDTO sec : req.getSections()) {
            if (sec.getStudents() == null || sec.getStudents().isEmpty()) continue;

            // 1. Get or Create Course (e.g. SQDB2026-H1, SQDB2026-SV, SQDB2026, TDT2026)
            String courseCode;
            String courseName;
            if ("SQDB(H1)".equals(sec.getTargetType())) {
                courseCode = "SQDB" + year + "-H1";
                courseName = "Khóa Đào tạo SQDB (Hạng 1) Năm " + year;
            } else if ("SQDB(SV)".equals(sec.getTargetType())) {
                courseCode = "SQDB" + year + "-SV";
                courseName = "Khóa Đào tạo SQDB (Sinh viên) Năm " + year;
            } else if ("SQDB(XN)".equals(sec.getTargetType())) {
                courseCode = "SQDB" + year + "-XN";
                courseName = "Khóa Đào tạo SQDB (Xuất ngũ) Năm " + year;
            } else {
                courseCode = sec.getTargetType() + year;
                courseName = "Khóa Đào tạo " + sec.getTargetName() + " Năm " + year;
            }

            Course course = courseRepository.findByCode(courseCode).orElseGet(() ->
                    courseRepository.save(Course.builder()
                            .code(courseCode)
                            .name(courseName)
                            .startYear(year)
                            .endYear(year)
                            .build())
            );

            // 2. Get or Create Major
            String majorCode = sec.getMajorCode().toUpperCase().trim();
            String majorName = sec.getMajorName();
            if (majorName == null || majorName.isBlank() || isCorrupted(majorName)) {
                majorName = mapMajorName(majorCode);
            }
            final String finalMajorName = majorName;
            Major major = majorRepository.findByCode(majorCode).orElseGet(() ->
                    majorRepository.save(Major.builder()
                            .code(majorCode)
                            .name(finalMajorName)
                            .department(defaultDept)
                            .build())
            );

            // 3. Get or Create ClassEntity
            String classCode = sec.getClassCode();
            String className = sec.getClassName();
            if (className == null || className.isBlank() || isCorrupted(className)) {
                className = "Lớp " + getTargetName(sec.getTargetType()) + " " + year + " - " + finalMajorName;
            }
            final String finalClassName = className;
            ClassEntity clazz = classRepository.findByCode(classCode).orElseGet(() ->
                    classRepository.save(ClassEntity.builder()
                            .code(classCode)
                            .name(finalClassName)
                            .major(major)
                            .course(course)
                            .build())
            );

            // Cập nhật tên lớp chuẩn nếu lớp đã tồn tại từ trước
            if (!clazz.getName().equals(finalClassName) && !finalClassName.isBlank()) {
                clazz.setName(finalClassName);
                classRepository.save(clazz);
            }

            if (!createdClasses.contains(classCode)) {
                createdClasses.add(classCode);
            }

            // 4. Save Students
            for (ParsedStudentDTO sDTO : sec.getStudents()) {
                String sCode = sDTO.getStudentCode();
                Optional<Student> existingOpt = studentRepository.findByStudentCode(sCode);

                LocalDate dob = parseLocalDate(sDTO.getDob());
                Student student;
                String fullName = recoverString(sDTO.getFullName());
                String pob = recoverString(sDTO.getPob());

                if (existingOpt.isPresent()) {
                    student = existingOpt.get();
                    student.setFullName(fullName);
                    student.setDob(dob);
                    student.setPob(pob);
                    student.setGender(sDTO.getGender());
                    student.setClazz(clazz);
                } else {
                    student = Student.builder()
                            .studentCode(sCode)
                            .fullName(fullName)
                            .dob(dob)
                            .pob(pob)
                            .gender(sDTO.getGender() != null && !sDTO.getGender().isBlank() ? sDTO.getGender() : "Nam")
                            .clazz(clazz)
                            .status("DANG_HOC")
                            .build();
                }

                Student savedStudent = studentRepository.save(student);

                // Đồng bộ bảng đánh giá với lớp hiện tại của học viên
                Optional<StudentEvaluation> evalOpt = evaluationRepository.findByStudentId(savedStudent.getId());
                if (evalOpt.isPresent()) {
                    StudentEvaluation eval = evalOpt.get();
                    eval.setClazz(clazz);
                    evaluationRepository.save(eval);
                } else {
                    evaluationRepository.save(StudentEvaluation.builder()
                            .student(savedStudent)
                            .clazz(clazz)
                            .conductGrade("KHA")
                            .graduationClassification("CHUA_XET")
                            .build());
                }

                totalSaved++;
            }
        }

        // Đồng bộ lại PostgreSQL auto-increment sequence
        try {
            dataInitializer.syncPostgresSequences();
        } catch (Exception ignored) {}

        return Map.of(
                "success", true,
                "message", "Đã nạp thành công " + totalSaved + " học viên vào " + createdClasses.size() + " lớp học!",
                "totalStudents", totalSaved,
                "classes", createdClasses
        );
    }

    private ParsedSectionDTO buildSectionDTO(String title, String khoa, String majorRaw, String targetType, String targetName, int year, String yearShort, String classNamingMode, List<ParsedStudentDTO> students, Map<String, Integer> classCounter, Map<String, Integer> studentCounter) {
        String majorCode = mapMajorCode(majorRaw);
        String majorName = mapMajorName(majorRaw);

        // Class index counter per targetType + majorCode
        String classKey = targetType + "_" + majorCode;
        int counter = classCounter.getOrDefault(classKey, 0) + 1;
        classCounter.put(classKey, counter);

        // Class Code quy ước chuẩn: [Đào tạo]-[Đối tượng]-[Chuyên ngành]-[Lớp]
        // Ví dụ: SQDB-XN-TSBB-01, SQDB-H1-TSBB-01, SQDB-SV-BCHT-01, KDT-DL-01
        String targetPrefix;
        if ("SQDB(XN)".equals(targetType)) targetPrefix = "SQDB-XN";
        else if ("SQDB(H1)".equals(targetType)) targetPrefix = "SQDB-H1";
        else if ("SQDB(SV)".equals(targetType)) targetPrefix = "SQDB-SV";
        else targetPrefix = targetType; // TDT, KDT, NVKT, HSQ, SQDB

        String classCode;
        if ("THEO_KHOA".equalsIgnoreCase(classNamingMode) && !khoa.isBlank()) {
            classCode = String.format("%s-%s-%02d", khoa, majorCode, counter);
        } else {
            classCode = String.format("%s-%s-%02d", targetPrefix, majorCode, counter);
        }

        String className;
        if ("THEO_KHOA".equalsIgnoreCase(classNamingMode) && !khoa.isBlank()) {
            className = "Lớp " + targetName + " (" + khoa + ") - " + majorName + (counter > 1 ? " " + counter : "");
        } else {
            className = "Lớp " + targetName + " " + year + " - " + majorName + " " + String.format("%02d", counter);
        }

        // Generate Student Code range and assign to students
        // Code format: [targetPrefix][yearShort][majorCode][001..]
        String prefix;
        if (targetType.equals("SQDB")) {
            prefix = yearShort + majorCode;
        } else if (targetType.equals("SQDB(H1)")) {
            prefix = yearShort + "H1-" + majorCode;
        } else if (targetType.equals("SQDB(SV)")) {
            prefix = yearShort + "SV-" + majorCode;
        } else if (targetType.equals("SQDB(XN)")) {
            prefix = yearShort + "XN-" + majorCode;
        } else {
            prefix = yearShort + targetType + "-" + majorCode;
        }

        String seqKey = targetType + "_" + year + "_" + majorCode;
        int startStt = studentCounter.getOrDefault(seqKey, 0) + 1;
        int currentStt = startStt;

        for (ParsedStudentDTO s : students) {
            String code = String.format("%s%03d", prefix, currentStt++);
            s.setStudentCode(code);
        }

        studentCounter.put(seqKey, currentStt - 1);

        String codeRange = String.format("%s%03d - %s%03d", prefix, startStt, prefix, currentStt - 1);

        return ParsedSectionDTO.builder()
                .rawTitle(title)
                .rawMajor(majorRaw)
                .khoaName(khoa)
                .targetType(targetType)
                .targetName(targetName)
                .majorCode(majorCode)
                .majorName(majorName)
                .classCode(classCode)
                .className(className)
                .studentCount(students.size())
                .codeRange(codeRange)
                .students(students)
                .build();
    }

    private String mapMajorCode(String raw) {
        if (raw == null) return "BB";
        String upper = raw.trim().toUpperCase();
        Set<String> validCodes = Set.of(
            "TSBB", "DL", "C60", "COI", "C100", "DKZ", "SPG9", "AGS17",
            "PK127", "PK37", "PK57", "PXK", "KTPB", "VTD", "HTD", "BVU",
            "NVQY", "NVBQVK", "NVBQD", "NA", "CB", "BB", "BCHT", "PB",
            "TT", "TTG", "HH", "HC", "KT", "QY", "HT"
        );
        if (validCodes.contains(upper)) {
            if ("HT".equals(upper)) return "BCHT";
            return upper;
        }

        String lower = raw.toLowerCase();
        if (lower.contains("đại liên") || lower.contains("dai lien") || lower.contains("at đại liên") || lower.equals("dl")) return "DL";
        if (lower.contains("cối 60") || lower.contains("coi 60") || lower.contains("c60")) return "C60";
        if (lower.contains("cối 100") || lower.contains("coi 100") || lower.contains("c100")) return "C100";
        if (lower.contains("cối 82") || lower.contains("coi 82") || lower.contains("co82") || lower.contains("cối") || lower.contains("coi")) return "COI";
        if (lower.contains("ags17") || lower.contains("ags-17") || lower.contains("ags")) return "AGS17";
        if (lower.contains("spg9") || lower.contains("spg-9") || lower.contains("spg")) return "SPG9";
        if (lower.contains("đkz") || lower.contains("dkz")) return "DKZ";
        if (lower.contains("ppk 37") || lower.contains("pk37") || lower.contains("37mm")) return "PK37";
        if (lower.contains("ppk 57") || lower.contains("pk57") || lower.contains("57mm")) return "PK57";
        if (lower.contains("pháo xe kéo") || lower.contains("pxk")) return "PXK";
        if (lower.contains("kế toán pháo") || lower.contains("ktpb")) return "KTPB";
        if (lower.contains("vô tuyến") || lower.contains("vtd")) return "VTD";
        if (lower.contains("hữu tuyến") || lower.contains("htd")) return "HTD";
        if (lower.contains("báo vụ") || lower.contains("bvu")) return "BVU";
        if (lower.contains("quân y") || lower.contains("nvqy")) return "NVQY";
        if (lower.contains("bảo quản vũ khí") || lower.contains("bqvk") || lower.contains("nvbqvk")) return "NVBQVK";
        if (lower.contains("bảo quản đạn") || lower.contains("bqd") || lower.contains("nvbqd")) return "NVBQD";
        if (lower.contains("nấu ăn") || lower.contains("na")) return "NA";
        if (lower.contains("công binh") || lower.contains("cbct") || lower.contains("cb")) return "CB";
        if (lower.contains("trinh sát") || lower.contains("tsbb") || lower.contains("tsbd")) return "TSBB";
        if (lower.contains("smpk") || lower.contains("12,7") || lower.contains("12.7") || lower.contains("pk127")) return "PK127";
        if (lower.contains("bcht") || lower.contains("hợp thành")) return "BCHT";
        if (lower.contains("bộ binh") || lower.equals("bb")) return "BB";
        if (lower.contains("pháo binh") || lower.equals("pb")) return "PB";
        if (lower.contains("thông tin") || lower.equals("tt")) return "TT";
        if (lower.contains("tăng") || lower.contains("thiết giáp") || lower.equals("ttg")) return "TTG";
        if (lower.contains("phòng hóa") || lower.contains("hóa học") || lower.equals("hh")) return "HH";
        if (lower.contains("hậu cần") || lower.equals("hc")) return "HC";
        if (lower.contains("quân khí") || lower.equals("kt")) return "KT";
        return "BB";
    }

    private String mapMajorName(String raw) {
        String code = mapMajorCode(raw);
        switch (code) {
            case "TSBB": return "Trinh sát Bộ binh";
            case "DL": return "Khẩu đội trưởng Đại liên";
            case "C60": return "Súng Cối 60mm";
            case "COI": return "Súng Cối 82mm";
            case "C100": return "Súng Cối 100mm";
            case "DKZ": return "Súng ĐKZ 82-K65";
            case "SPG9": return "Khẩu đội trưởng ĐKZ SPG-9";
            case "AGS17": return "Súng phóng lựu AGS-17";
            case "PK127": return "Súng máy Phòng không 12,7mm";
            case "PK37": return "Khẩu đội trưởng PPK 37mm";
            case "PK57": return "Khẩu đội trưởng PPK 57mm";
            case "PXK": return "Khẩu đội trưởng Pháo xe kéo";
            case "KTPB": return "Tiểu đội trưởng Kế toán Pháo binh";
            case "VTD": return "Tiểu đội trưởng Vô tuyến điện";
            case "HTD": return "Tiểu đội trưởng Hữu tuyến điện";
            case "BVU": return "Nhân viên Báo vụ";
            case "NVQY": return "Nhân viên Quân y Đại đội";
            case "NVBQVK": return "Nhân viên Bảo quản Vũ khí";
            case "NVBQD": return "Nhân viên Bảo quản Đạn";
            case "NA": return "Tiểu đội trưởng Nấu ăn";
            case "CB": return "Công binh công trình";
            case "BB": return "Binh chủng Hợp thành (Bộ binh)";
            case "BCHT": return "Binh chủng Hợp thành";
            case "PB": return "Binh chủng Pháo binh";
            case "TT": return "Thông tin Kỹ thuật / Liên lạc";
            case "TTG": return "Binh chủng Tăng - Thiết giáp";
            case "HH": return "Binh chủng Phòng hóa";
            case "HC": return "Hậu cần Quân sự";
            case "KT": return "Kỹ thuật Quân khí";
            case "QY": return "Quân y";
            default: return raw.replace("Chuyên ngành:", "").split(";")[0].trim();
        }
    }

    private String detectTargetTypeFromText(String text, String override) {
        if (override != null && !override.isBlank() && !override.equalsIgnoreCase("AUTO") && !override.equalsIgnoreCase("SQDB")) {
            return normalizeTargetCode(override);
        }

        String lower = text.toLowerCase();
        if (lower.contains("khẩu đội trưởng") || lower.contains("khau doi")) return "KDT";
        if (lower.contains("tiểu đội trưởng") || lower.contains("tieu doi")) return "TDT";
        if (lower.contains("nhân viên") || lower.contains("kỹ thuật") || lower.contains("nvkt")) return "NVKT";
        if (lower.contains("hạ sĩ quan chỉ huy") || lower.contains("hsqch")) return "HSQ";

        // SQDB Sub-targets
        if (lower.contains("hạng 1") || lower.contains("hang 1") || lower.contains("dự bị hạng 1")) {
            return "SQDB(H1)";
        }
        if (lower.contains("sinh viên") || lower.contains("sinh vien") || lower.contains("tnđh") || lower.contains("tndh") || lower.contains("đại học")) {
            return "SQDB(SV)";
        }
        if (lower.contains("xuất ngũ") || lower.contains("xuat ngu")) {
            return "SQDB(XN)";
        }
        return "SQDB";
    }

    private String normalizeTargetCode(String code) {
        if (code == null) return "SQDB";
        String upper = code.trim().toUpperCase();
        switch (upper) {
            case "SQDB_H1":
            case "SQDB(H1)":
            case "SQDB-H1":
                return "SQDB(H1)";
            case "SQDB_SV":
            case "SQDB(SV)":
            case "SQDB-SV":
                return "SQDB(SV)";
            case "SQDB_XN":
            case "SQDB(XN)":
            case "SQDB-XN":
                return "SQDB(XN)";
            default:
                return upper;
        }
    }

    private String getTargetName(String targetCode) {
        switch (targetCode) {
            case "SQDB(H1)": return "SQDB(Hạng 1)";
            case "SQDB(SV)": return "SQDB(Sinh viên)";
            case "SQDB(XN)": return "SQDB(Xuất ngũ)";
            case "TDT": return "Tiểu đội trưởng";
            case "KDT": return "Khẩu đội trưởng";
            case "NVKT": return "Nhân viên Kỹ thuật";
            case "HSQ": return "Hạ sĩ quan Chỉ huy";
            case "SQDB":
            default:
                return "Sĩ quan Dự bị";
        }
    }

    private String extractKhoaText(String text) {
        Matcher m = Pattern.compile("Khóa\\s+(\\d+)", Pattern.CASE_INSENSITIVE).matcher(text);
        if (m.find()) {
            return "K" + m.group(1);
        }
        return "";
    }

    private String extractMajorText(String text) {
        int idx = text.indexOf("Chuyên ngành:");
        if (idx != -1) {
            return text.substring(idx).trim();
        }
        return text;
    }

    private String getRowFullText(Row row) {
        StringBuilder sb = new StringBuilder();
        for (int c = 0; c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null) {
                sb.append(getCellString(cell)).append(" ");
            }
        }
        return sb.toString();
    }

    private String getCellString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return DateTimeFormatter.ofPattern("dd/MM/yyyy").format(cell.getLocalDateTimeCellValue());
                }
                double val = cell.getNumericCellValue();
                if (val == Math.floor(val)) return String.valueOf((long) val);
                return String.valueOf(val);
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue();
                } catch (Exception e) {
                    return String.valueOf(cell.getNumericCellValue());
                }
            default: return "";
        }
    }

    private Integer parseNumericCell(Cell cell) {
        try {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
            }
            if (cell.getCellType() == CellType.STRING) {
                String str = cell.getStringCellValue().trim();
                return (int) Double.parseDouble(str);
            }
        } catch (Exception ignored) {}
        return null;
    }

    private LocalDate parseLocalDate(String dobStr) {
        if (dobStr == null || dobStr.isBlank()) return LocalDate.of(2003, 1, 1);
        dobStr = dobStr.trim().replace('.', '/').replace('-', '/');
        String[] parts = dobStr.split("/");
        try {
            if (parts.length == 3) {
                int d = Integer.parseInt(parts[0]);
                int m = Integer.parseInt(parts[1]);
                int y = Integer.parseInt(parts[2]);
                if (y < 100) y += 2000;
                return LocalDate.of(y, m, d);
            }
        } catch (Exception ignored) {}
        return LocalDate.of(2003, 1, 1);
    }

    private boolean isCorrupted(String text) {
        if (text == null || text.isBlank()) return false;
        return text.contains("ß╗") || text.contains("─⌐") || text.contains("├í") || text.contains("├┤") || text.contains("\uFFFD");
    }

    private String recoverString(String text) {
        if (text == null || text.isBlank()) return text;
        if (isCorrupted(text)) {
            try {
                String recovered = new String(text.getBytes(java.nio.charset.StandardCharsets.ISO_8859_1), java.nio.charset.StandardCharsets.UTF_8);
                if (!recovered.contains("\uFFFD") && !isCorrupted(recovered)) {
                    return recovered;
                }
            } catch (Exception ignored) {}
        }
        return text;
    }
}