package com.intranet.grade.service;

import com.intranet.grade.dto.MatrixResponseDTO;
import com.intranet.grade.dto.StudentRowDTO;
import com.intranet.grade.dto.SubjectColumnDTO;
import com.intranet.grade.entity.*;
import com.intranet.grade.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExcelService {

    private final GradeMatrixService gradeMatrixService;
    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final GradeRepository gradeRepository;
    private final StudentEvaluationRepository evaluationRepository;
    private final DepartmentRepository departmentRepository;
    private final CurriculumRepository curriculumRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final MajorRepository majorRepository;
    private final CourseRepository courseRepository;

    public byte[] exportClassMatrixToExcel(Integer classId, Integer semester) throws IOException {
        MatrixResponseDTO matrix = gradeMatrixService.getClassMatrix(classId, semester);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("BangDiem_Lop_" + matrix.getClassCode());

            // Fonts & Styles
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerFont.setFontName("Times New Roman");

            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle standardHeaderStyle = workbook.createCellStyle();
            standardHeaderStyle.setFont(headerFont);
            standardHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
            standardHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            standardHeaderStyle.setBorderTop(BorderStyle.THIN);
            standardHeaderStyle.setBorderBottom(BorderStyle.THIN);
            standardHeaderStyle.setBorderLeft(BorderStyle.THIN);
            standardHeaderStyle.setBorderRight(BorderStyle.THIN);
            standardHeaderStyle.setWrapText(true);

            // SPECIAL VERTICAL HEADER STYLE (Chữ xoay dọc 90 độ)
            CellStyle verticalSubjectHeaderStyle = workbook.createCellStyle();
            verticalSubjectHeaderStyle.setFont(headerFont);
            verticalSubjectHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
            verticalSubjectHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            verticalSubjectHeaderStyle.setBorderTop(BorderStyle.THIN);
            verticalSubjectHeaderStyle.setBorderBottom(BorderStyle.THIN);
            verticalSubjectHeaderStyle.setBorderLeft(BorderStyle.THIN);
            verticalSubjectHeaderStyle.setBorderRight(BorderStyle.THIN);
            verticalSubjectHeaderStyle.setRotation((short) 90); // XOAY DỌC 90 ĐỘ

            CellStyle dataCellStyle = workbook.createCellStyle();
            Font dataFont = workbook.createFont();
            dataFont.setFontHeightInPoints((short) 11);
            dataFont.setFontName("Times New Roman");
            dataCellStyle.setFont(dataFont);
            dataCellStyle.setBorderTop(BorderStyle.THIN);
            dataCellStyle.setBorderBottom(BorderStyle.THIN);
            dataCellStyle.setBorderLeft(BorderStyle.THIN);
            dataCellStyle.setBorderRight(BorderStyle.THIN);
            dataCellStyle.setAlignment(HorizontalAlignment.CENTER);
            dataCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Title Row
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("BẢNG ĐIỂM VÀ ĐÁNH GIÁ TỐT NGHIỆP LỚP: " + matrix.getClassName().toUpperCase());
            titleCell.setCellStyle(titleStyle);

            int totalCols = 4 + matrix.getColumns().size() + 6;
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, totalCols - 1));

            // Row 2 & Row 3 (Headers)
            Row row1 = sheet.createRow(2);
            Row row2 = sheet.createRow(3);
            row1.setHeightInPoints(30);
            row2.setHeightInPoints(120); // Dynamic height for vertical subject headers

            String[] fixedHeadersBefore = {"TT", "Số vào sổ\n(MSSV)", "Họ và tên", "Ngày tháng\nnăm sinh"};
            for (int i = 0; i < fixedHeadersBefore.length; i++) {
                Cell cell = row1.createCell(i);
                cell.setCellValue(fixedHeadersBefore[i]);
                cell.setCellStyle(standardHeaderStyle);
                row2.createCell(i).setCellStyle(standardHeaderStyle);
                sheet.addMergedRegion(new CellRangeAddress(2, 3, i, i));
            }

            // Subject Header Group (Kết quả học tập toàn khóa)
            int subjectStartCol = 4;
            int subjectEndCol = subjectStartCol + matrix.getColumns().size() - 1;

            if (subjectEndCol >= subjectStartCol) {
                Cell mainGroupCell = row1.createCell(subjectStartCol);
                mainGroupCell.setCellValue("Kết quả học tập toàn khóa");
                mainGroupCell.setCellStyle(standardHeaderStyle);

                for (int c = subjectStartCol + 1; c <= subjectEndCol; c++) {
                    row1.createCell(c).setCellStyle(standardHeaderStyle);
                }
                if (subjectEndCol > subjectStartCol) {
                    sheet.addMergedRegion(new CellRangeAddress(2, 2, subjectStartCol, subjectEndCol));
                }

                // Row 3: Sub-headers for Subjects with VERTICAL 90-degree TEXT
                for (int i = 0; i < matrix.getColumns().size(); i++) {
                    SubjectColumnDTO sub = matrix.getColumns().get(i);
                    int colIdx = subjectStartCol + i;
                    Cell subCell = row2.createCell(colIdx);
                    subCell.setCellValue(sub.getSubjectName() + "\n(" + sub.getSubjectCode() + ")");
                    subCell.setCellStyle(verticalSubjectHeaderStyle);
                }
            }

            // Fixed Headers After Subjects
            String[] fixedHeadersAfter = {
                    "Trung bình\ncộng (TBC)",
                    "Phân loại\nrèn luyện",
                    "Điều kiện\nthi TN",
                    "Điểm TN",
                    "Xét TN",
                    "Quê quán"
            };

            int afterStartCol = Math.max(subjectEndCol + 1, 4);
            for (int i = 0; i < fixedHeadersAfter.length; i++) {
                int colIdx = afterStartCol + i;
                Cell cell = row1.createCell(colIdx);
                cell.setCellValue(fixedHeadersAfter[i]);
                cell.setCellStyle(standardHeaderStyle);
                row2.createCell(colIdx).setCellStyle(standardHeaderStyle);
                sheet.addMergedRegion(new CellRangeAddress(2, 3, colIdx, colIdx));
            }

            // Data Rows
            int rowIdx = 4;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (StudentRowDTO studentRow : matrix.getRows()) {
                Row r = sheet.createRow(rowIdx++);
                r.setHeightInPoints(22);

                int cIdx = 0;
                // TT
                Cell cTT = r.createCell(cIdx++);
                cTT.setCellValue(studentRow.getStt());
                cTT.setCellStyle(dataCellStyle);

                // Số vào sổ
                Cell cCode = r.createCell(cIdx++);
                cCode.setCellValue(studentRow.getStudentCode());
                cCode.setCellStyle(dataCellStyle);

                // Họ tên
                Cell cName = r.createCell(cIdx++);
                cName.setCellValue(studentRow.getFullName());
                cName.setCellStyle(dataCellStyle);

                // Ngày sinh
                Cell cDob = r.createCell(cIdx++);
                cDob.setCellValue(studentRow.getDob() != null ? studentRow.getDob().format(formatter) : "");
                cDob.setCellStyle(dataCellStyle);

                // Subject Scores
                for (SubjectColumnDTO sub : matrix.getColumns()) {
                    Cell cScore = r.createCell(cIdx++);
                    cScore.setCellStyle(dataCellStyle);
                    if (studentRow.getGrades() != null && studentRow.getGrades().containsKey(sub.getSubjectId())) {
                        BigDecimal score = studentRow.getGrades().get(sub.getSubjectId()).getScore();
                        if (score != null) {
                            cScore.setCellValue(score.doubleValue());
                        }
                    }
                }

                // TBC
                Cell cTbc = r.createCell(cIdx++);
                cTbc.setCellStyle(dataCellStyle);
                if (studentRow.getTbcScore() != null) cTbc.setCellValue(studentRow.getTbcScore().doubleValue());

                // Rèn luyện
                Cell cConduct = r.createCell(cIdx++);
                cConduct.setCellValue(studentRow.getConductGrade());
                cConduct.setCellStyle(dataCellStyle);

                // ĐK thi TN
                Cell cEligibility = r.createCell(cIdx++);
                cEligibility.setCellValue(studentRow.getGradExamEligibilityText());
                cEligibility.setCellStyle(dataCellStyle);

                // Điểm TN
                Cell cGradExam = r.createCell(cIdx++);
                cGradExam.setCellStyle(dataCellStyle);
                if (studentRow.getFinalGraduationScore() != null) cGradExam.setCellValue(studentRow.getFinalGraduationScore().doubleValue());

                // Xét TN
                Cell cClassification = r.createCell(cIdx++);
                cClassification.setCellValue(studentRow.getGraduationClassification());
                cClassification.setCellStyle(dataCellStyle);

                // Quê quán
                Cell cPob = r.createCell(cIdx++);
                cPob.setCellValue(studentRow.getPob() != null ? studentRow.getPob() : "");
                cPob.setCellStyle(dataCellStyle);
            }

            // Auto-size columns
            for (int i = 0; i < totalCols; i++) {
                if (i >= subjectStartCol && i <= subjectEndCol) {
                    sheet.setColumnWidth(i, 12 * 256); // Narrow column for vertical headers
                } else {
                    sheet.autoSizeColumn(i);
                }
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void importClassMatrixFromExcel(Integer classId, MultipartFile file) throws IOException {
        ClassEntity clazz = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học ID: " + classId));

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            // Find Header Rows
            Row headerRow1 = sheet.getRow(2);
            Row headerRow2 = sheet.getRow(3);

            if (headerRow1 == null || headerRow2 == null) {
                throw new IllegalArgumentException("Định dạng file Excel không hợp lệ. Thiếu dòng tiêu đề.");
            }

            // Parse Subject Columns (from col 4 onwards until TBC column)
            List<Subject> subjectList = new ArrayList<>();
            Map<Integer, Integer> colToSubjectIdMap = new HashMap<>();

            int colIdx = 4;
            while (colIdx < headerRow2.getLastCellNum()) {
                Cell cell = headerRow2.getCell(colIdx);
                if (cell != null) {
                    String val = cell.getStringCellValue().trim();
                    if (val.contains("Trung bình") || val.contains("TBC") || val.contains("Phân loại")) {
                        break; // Reached summary columns
                    }

                    // Extract Code e.g. "Kiến trúc (INT1001)" -> "INT1001"
                    String subjectCode = extractSubjectCode(val);
                    if (subjectCode != null) {
                        Optional<Subject> subOpt = subjectRepository.findByCode(subjectCode);
                        Subject subject;
                        if (subOpt.isPresent()) {
                            subject = subOpt.get();
                        } else {
                            // Auto create subject if not found
                            Department defaultDept = departmentRepository.findAll().stream().findFirst().orElse(null);
                            subject = subjectRepository.save(Subject.builder()
                                    .code(subjectCode)
                                    .name(val.split("\n")[0])
                                    .credits(3)
                                    .department(defaultDept)
                                    .build());
                        }
                        subjectList.add(subject);
                        colToSubjectIdMap.put(colIdx, subject.getId());
                    }
                }
                colIdx++;
            }

            // Parse Student Data Rows starting at row 4
            final int finalColIdx = colIdx;
            for (int rIdx = 4; rIdx <= sheet.getLastRowNum(); rIdx++) {
                Row row = sheet.getRow(rIdx);
                if (row == null) continue;

                Cell codeCell = row.getCell(1); // Số vào sổ / MSSV
                Cell nameCell = row.getCell(2); // Họ tên
                Cell dobCell = row.getCell(3); // Ngày sinh

                if (codeCell == null || nameCell == null) continue;

                String studentCode = getCellValueAsString(codeCell);
                String fullName = getCellValueAsString(nameCell);
                if (studentCode.isEmpty() || fullName.isEmpty()) continue;

                LocalDate dob = parseDateCell(dobCell);

                // Find or create student
                Student student = studentRepository.findByStudentCode(studentCode)
                        .orElseGet(() -> studentRepository.save(Student.builder()
                                .studentCode(studentCode)
                                .fullName(fullName)
                                .dob(dob != null ? dob : LocalDate.of(2002, 1, 1))
                                .pob(getCellValueAsString(row.getCell(finalColIdx + 5)))
                                .clazz(clazz)
                                .build()));

                // Import Grade Scores for subjects
                for (Map.Entry<Integer, Integer> entry : colToSubjectIdMap.entrySet()) {
                    int c = entry.getKey();
                    Integer subjectId = entry.getValue();

                    Cell scoreCell = row.getCell(c);
                    if (scoreCell != null && scoreCell.getCellType() == CellType.NUMERIC) {
                        double scoreVal = scoreCell.getNumericCellValue();
                        BigDecimal score = BigDecimal.valueOf(scoreVal).setScale(2, RoundingMode.HALF_UP);

                        Subject sub = subjectRepository.findById(subjectId).orElse(null);
                        if (sub != null) {
                            Optional<Grade> gradeOpt = gradeRepository.findByStudentIdAndSubjectIdAndClazzId(student.getId(), sub.getId(), clazz.getId());
                            Grade g = gradeOpt.orElseGet(() -> Grade.builder()
                                    .student(student)
                                    .subject(sub)
                                    .clazz(clazz)
                                    .semester(1)
                                    .build());
                            g.setScore(score);
                            gradeRepository.save(g);
                        }
                    }
                }

                // Import Conduct Grade if present
                Cell conductCell = row.getCell(finalColIdx + 1);
                if (conductCell != null) {
                    String conduct = getCellValueAsString(conductCell);
                    StudentEvaluation eval = evaluationRepository.findByStudentId(student.getId())
                            .orElseGet(() -> StudentEvaluation.builder().student(student).clazz(clazz).build());
                    if (!conduct.isEmpty()) eval.setConductGrade(conduct);
                    evaluationRepository.save(eval);
                }
            }
        }
    }

    private String extractSubjectCode(String cellValue) {
        if (cellValue.contains("(") && cellValue.contains(")")) {
            return cellValue.substring(cellValue.lastIndexOf("(") + 1, cellValue.lastIndexOf(")")).trim();
        }
        return cellValue;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.STRING) return cell.getStringCellValue().trim();
        if (cell.getCellType() == CellType.NUMERIC) return String.valueOf((long) cell.getNumericCellValue());
        return "";
    }

    private LocalDate parseDateCell(Cell cell) {
        if (cell == null) return LocalDate.of(2002, 1, 1);
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        if (cell.getCellType() == CellType.STRING) {
            try {
                return LocalDate.parse(cell.getStringCellValue().trim(), DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            } catch (Exception ignored) {}
        }
        return LocalDate.of(2002, 1, 1);
    }

    public byte[] exportStudentsToExcel(Integer classId) throws IOException {
        List<Student> students;
        String classTitle = "TOÀN BỘ CÁC LỚP HỌC VIÊN QUÂN SỰ";
        if (classId != null) {
            ClassEntity clazz = classRepository.findById(classId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học ID: " + classId));
            students = studentRepository.findByClazzIdOrderByStudentCodeAsc(classId);
            classTitle = "LỚP: " + clazz.getClassName() + " (" + clazz.getClassCode() + ")";
        } else {
            students = studentRepository.findAll();
            students.sort(Comparator.comparing(Student::getFullName, Comparator.nullsLast(Comparator.naturalOrder())));
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("DanhSach_HocVien");
            sheet.setDisplayGridlines(true);

            // Fonts & Styles
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleFont.setFontName("Times New Roman");

            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            Font subTitleFont = workbook.createFont();
            subTitleFont.setItalic(true);
            subTitleFont.setFontHeightInPoints((short) 11);
            subTitleFont.setFontName("Times New Roman");
            CellStyle subTitleStyle = workbook.createCellStyle();
            subTitleStyle.setFont(subTitleFont);
            subTitleStyle.setAlignment(HorizontalAlignment.CENTER);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerFont.setFontName("Times New Roman");

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            Font dataFont = workbook.createFont();
            dataFont.setFontHeightInPoints((short) 11);
            dataFont.setFontName("Times New Roman");

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setFont(dataFont);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle centerDataStyle = workbook.createCellStyle();
            centerDataStyle.cloneStyleFrom(dataStyle);
            centerDataStyle.setAlignment(HorizontalAlignment.CENTER);

            // Title rows
            Row r0 = sheet.createRow(0);
            Cell c0 = r0.createCell(0);
            c0.setCellValue("DANH SÁCH HỌC VIÊN QUÂN SỰ");
            c0.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            Row r1 = sheet.createRow(1);
            Cell c1 = r1.createCell(0);
            c1.setCellValue(classTitle);
            c1.setCellStyle(subTitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 6));

            // Headers (đã bỏ cột Giới tính theo yêu cầu)
            String[] headers = {"STT", "Số hiệu HV", "Họ và tên", "Ngày sinh", "Quê quán", "Cấp bậc", "Lớp / Đại đội"};
            Row headerRow = sheet.createRow(3);
            headerRow.setHeightInPoints(24);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 4;
            int stt = 1;
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (Student s : students) {
                Row row = sheet.createRow(rowIdx++);
                Cell cellStt = row.createCell(0);
                cellStt.setCellValue(stt++);
                cellStt.setCellStyle(centerDataStyle);

                Cell cellCode = row.createCell(1);
                cellCode.setCellValue(s.getStudentCode() != null ? s.getStudentCode() : "");
                cellCode.setCellStyle(centerDataStyle);

                Cell cellName = row.createCell(2);
                cellName.setCellValue(s.getFullName() != null ? s.getFullName() : "");
                cellName.setCellStyle(dataStyle);

                Cell cellDob = row.createCell(3);
                cellDob.setCellValue(s.getDob() != null ? s.getDob().format(dtf) : "");
                cellDob.setCellStyle(centerDataStyle);

                Cell cellPob = row.createCell(4);
                cellPob.setCellValue(s.getPob() != null ? s.getPob() : "");
                cellPob.setCellStyle(dataStyle);

                Cell cellRank = row.createCell(5);
                cellRank.setCellValue("Học viên");
                cellRank.setCellStyle(centerDataStyle);

                Cell cellClass = row.createCell(6);
                String cName = (s.getClazz() != null) ? s.getClazz().getClassCode() : "";
                cellClass.setCellValue(cName);
                cellClass.setCellStyle(centerDataStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportCurriculumTemplate(String majorCode, String targetGroup) throws IOException {
        String code = (majorCode != null && !majorCode.isBlank()) ? majorCode.trim().toUpperCase() : "TSBB";
        Major major = majorRepository.findByCode(code).orElse(null);
        String majorName = major != null ? major.getName() : "Trinh sát Bộ binh";

        String tgName = "Sĩ quan Dự bị (SQDB)";
        if ("KHAU_DOI_TRUONG".equalsIgnoreCase(targetGroup)) tgName = "Khẩu đội trưởng";
        else if ("TIEU_DOI_TRUONG".equalsIgnoreCase(targetGroup)) tgName = "Tiểu đội trưởng";

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("KHUNG_CHUONG_TRINH_THI");
            sheet.setDisplayGridlines(true);

            // Fonts & Styles
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleFont.setFontName("Times New Roman");

            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            Font subTitleFont = workbook.createFont();
            subTitleFont.setBold(true);
            subTitleFont.setFontHeightInPoints((short) 11);
            subTitleFont.setFontName("Times New Roman");
            CellStyle subTitleStyle = workbook.createCellStyle();
            subTitleStyle.setFont(subTitleFont);
            subTitleStyle.setAlignment(HorizontalAlignment.CENTER);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerFont.setFontName("Times New Roman");

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setWrapText(true);

            Font dataFont = workbook.createFont();
            dataFont.setFontHeightInPoints((short) 11);
            dataFont.setFontName("Times New Roman");

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setFont(dataFont);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle centerDataStyle = workbook.createCellStyle();
            centerDataStyle.cloneStyleFrom(dataStyle);
            centerDataStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle examRowStyle = workbook.createCellStyle();
            examRowStyle.cloneStyleFrom(dataStyle);
            examRowStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            examRowStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            CellStyle examCenterRowStyle = workbook.createCellStyle();
            examCenterRowStyle.cloneStyleFrom(centerDataStyle);
            examCenterRowStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            examCenterRowStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Title rows
            Row r0 = sheet.createRow(0);
            Cell c0 = r0.createCell(0);
            c0.setCellValue("BỘ QUỐC PHÒNG - TRƯỜNG QUÂN SỰ");
            c0.setCellStyle(subTitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 9));

            Row r1 = sheet.createRow(1);
            Cell c1 = r1.createCell(0);
            c1.setCellValue("LỘ TRÌNH ĐÀO TẠO & KHUNG NỘI DUNG THI ĐÁNH GIÁ TỐT NGHIỆP");
            c1.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 9));

            Row r2 = sheet.createRow(2);
            Cell c2 = r2.createCell(0);
            c2.setCellValue("ĐỐI TƯỢNG: " + tgName.toUpperCase() + " | CHUYÊN NGÀNH: " + majorName.toUpperCase() + " (" + code + ")");
            c2.setCellStyle(subTitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 9));

            // Headers
            String[] headers = {
                    "STT",
                    "Mã môn / Mã thi",
                    "Tên môn học / Nội dung kiểm tra, thi",
                    "Số tín chỉ",
                    "Số tiết quy đổi",
                    "Học kỳ",
                    "Phân loại",
                    "Hình thức thi / kiểm tra",
                    "Hệ số",
                    "Khoa / Bộ môn phụ trách"
            };
            Row headerRow = sheet.createRow(4);
            headerRow.setHeightInPoints(28);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Standard illustrated subjects according to Major
            List<String[]> sampleRows = getSampleCurriculumRows(code);
            int rowIdx = 5;
            for (int i = 0; i < sampleRows.size(); i++) {
                String[] r = sampleRows.get(i);
                Row row = sheet.createRow(rowIdx++);
                boolean isExam = "Môn thi tốt nghiệp".equalsIgnoreCase(r[5]);
                CellStyle curStyle = isExam ? examRowStyle : dataStyle;
                CellStyle curCenter = isExam ? examCenterRowStyle : centerDataStyle;

                Cell cStt = row.createCell(0);
                cStt.setCellValue(i + 1);
                cStt.setCellStyle(curCenter);

                Cell cCode = row.createCell(1);
                cCode.setCellValue(r[0]);
                cCode.setCellStyle(curCenter);

                Cell cName = row.createCell(2);
                cName.setCellValue(r[1]);
                cName.setCellStyle(curStyle);

                Cell cCredits = row.createCell(3);
                cCredits.setCellValue(Integer.parseInt(r[2]));
                cCredits.setCellStyle(curCenter);

                Cell cHours = row.createCell(4);
                cHours.setCellValue(Integer.parseInt(r[3]));
                cHours.setCellStyle(curCenter);

                Cell cSem = row.createCell(5);
                cSem.setCellValue(Integer.parseInt(r[4]));
                cSem.setCellStyle(curCenter);

                Cell cType = row.createCell(6);
                cType.setCellValue(r[5]);
                cType.setCellStyle(curCenter);

                Cell cFormat = row.createCell(7);
                cFormat.setCellValue(r[6]);
                cFormat.setCellStyle(curStyle);

                Cell cWeight = row.createCell(8);
                cWeight.setCellValue(r[7]);
                cWeight.setCellStyle(curCenter);

                Cell cDept = row.createCell(9);
                cDept.setCellValue(r[8]);
                cDept.setCellStyle(curStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Sheet 2: Hướng dẫn
            Sheet guideSheet = workbook.createSheet("HUONG_DAN_SU_DUNG");
            guideSheet.setDisplayGridlines(true);
            Row gr0 = guideSheet.createRow(0);
            gr0.createCell(0).setCellValue("HƯỚNG DẪN ĐỊNH DẠNG IMPORT LỘ TRÌNH ĐÀO TẠO & DANH SÁCH THI");
            gr0.getCell(0).setCellStyle(titleStyle);
            guideSheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

            String[] instructions = {
                    "1. Mã môn / Mã thi: Mã định danh viết liền không dấu, ví dụ QS101, TS101, COI101, TN01...",
                    "2. Tên môn học / Nội dung thi: Tên môn huấn luyện hoặc nội dung thi tốt nghiệp.",
                    "3. Phân loại: Nhập chính xác 'Môn học phần' hoặc 'Môn thi tốt nghiệp'.",
                    "4. Học kỳ: Nhập 1 hoặc 2.",
                    "5. Hệ số: Nhập 1 hoặc 2.",
                    "6. Sau khi điền thêm/sửa đổi, tải file lên hệ thống tại tab 'Lộ trình đào tạo' -> nút 'Import Lộ Trình Excel'."
            };
            for (int i = 0; i < instructions.length; i++) {
                Row gr = guideSheet.createRow(i + 2);
                gr.createCell(0).setCellValue(instructions[i]);
            }
            guideSheet.autoSizeColumn(0);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private List<String[]> getSampleCurriculumRows(String majorCode) {
        List<String[]> list = new ArrayList<>();
        // Môn quân sự chung bắt buộc
        list.add(new String[]{"QS101", "Bắn súng tiểu liên AK bài 1", "3", "45", "1", "Môn học phần", "Thực hành bắn đạn thật", "1", "Khoa Quân sự chung"});
        list.add(new String[]{"QS102", "Điều lệnh Đội ngũ & Quản lý bộ đội", "2", "30", "1", "Môn học phần", "Thực hành thao trường", "1", "Khoa Quân sự chung"});
        list.add(new String[]{"QS103", "Chiến thuật Từng người & Tổ Bộ binh", "3", "45", "1", "Môn học phần", "Thực hành thực địa", "1", "Khoa Quân sự chung"});
        list.add(new String[]{"QS104", "Địa hình Quân sự & Bản đồ tác chiến", "3", "45", "1", "Môn học phần", "Đọc bản đồ & Định vị", "1", "Khoa Binh chủng"});
        list.add(new String[]{"QS105", "Công sự & Ngụy trang Phòng ngự", "2", "30", "1", "Môn học phần", "Thực hành công sự", "1", "Khoa Binh chủng"});
        list.add(new String[]{"QS106", "Quân y & Cấp cứu Thương binh Chiến trường", "2", "30", "1", "Môn học phần", "Băng bó cứu thương", "1", "Khoa Hậu cần"});

        // Môn chuyên ngành
        if ("TSBB".equalsIgnoreCase(majorCode)) {
            list.add(new String[]{"TS101", "Kỹ thuật Trinh sát Thực địa & Luồn sâu", "4", "60", "1", "Môn học phần", "Thực hành đêm & dã ngoại", "1", "Khoa Binh chủng"});
            list.add(new String[]{"TS102", "Chiến thuật Trung đội Trinh sát Bộ binh", "3", "45", "1", "Môn học phần", "Diễn tập chỉ huy", "1", "Khoa Binh chủng"});
            list.add(new String[]{"TS103", "Võ thuật Đặc nhiệm & Kỹ năng Sinh tồn", "3", "45", "1", "Môn học phần", "Thực hành đối kháng", "1", "Khoa Thể thao Quân sự"});
        } else if ("COI".equalsIgnoreCase(majorCode)) {
            list.add(new String[]{"COI101", "Cấu tạo & Quy tắc bắn Súng Cối 82mm", "4", "60", "1", "Môn học phần", "Thực hành bắn cối", "1", "Khoa Binh chủng"});
            list.add(new String[]{"COI102", "Khí tài Đo đạc & Tính toán Phần tử bắn", "3", "45", "1", "Môn học phần", "Đo đạc thực địa", "1", "Khoa Binh chủng"});
            list.add(new String[]{"COI103", "Chiến thuật Trung đội Hỏa lực Cối", "3", "45", "1", "Môn học phần", "Diễn tập chiến thuật", "1", "Khoa Binh chủng"});
        } else if ("DKZ".equalsIgnoreCase(majorCode)) {
            list.add(new String[]{"DKZ101", "Cấu tạo & Quy tắc bắn ĐKZ (82-K65, SPG-9)", "4", "60", "1", "Môn học phần", "Thực hành bắn ĐKZ", "1", "Khoa Binh chủng"});
            list.add(new String[]{"DKZ102", "Chiến thuật Phục kích Diệt tăng ĐKZ", "3", "45", "1", "Môn học phần", "Thao trường diệt tăng", "1", "Khoa Binh chủng"});
            list.add(new String[]{"DKZ103", "Kỹ thuật Hiệu chỉnh & Ngắm bắn ĐKZ", "3", "45", "1", "Môn học phần", "Hiệu chỉnh khí tài", "1", "Khoa Binh chủng"});
        } else if ("PK127".equalsIgnoreCase(majorCode)) {
            list.add(new String[]{"PK101", "Cấu tạo SMPK 12,7mm & Quy tắc bắn", "4", "60", "1", "Môn học phần", "Bắn súng máy PK", "1", "Khoa Binh chủng"});
            list.add(new String[]{"PK102", "Bắn Mục tiêu Bay thấp & Mặt đất", "3", "45", "1", "Môn học phần", "Bắn mục tiêu bay", "1", "Khoa Binh chủng"});
            list.add(new String[]{"PK103", "Chiến thuật Phân đội SMPK 12,7mm", "3", "45", "1", "Môn học phần", "Trận địa phòng không", "1", "Khoa Binh chủng"});
        } else if ("PB".equalsIgnoreCase(majorCode)) {
            list.add(new String[]{"PB101", "Lý thuyết & Quy tắc bắn Pháo binh", "4", "60", "1", "Môn học phần", "Bắn trận địa pháo", "1", "Khoa Binh chủng"});
            list.add(new String[]{"PB102", "Chỉ huy Hỏa lực & Đo đạc Trinh sát Pháo", "4", "60", "1", "Môn học phần", "Đo đạc chỉ huy", "1", "Khoa Binh chủng"});
        } else if ("TT".equalsIgnoreCase(majorCode)) {
            list.add(new String[]{"TT101", "Khí tài Vô tuyến điện Quân sự", "3", "45", "1", "Môn học phần", "Khai thác khí tài", "1", "Khoa Thông tin"});
            list.add(new String[]{"TT102", "Mạng Thông tin Chỉ huy Tác chiến", "4", "60", "1", "Môn học phần", "Thiết lập mạng thông tin", "1", "Khoa Thông tin"});
        } else {
            list.add(new String[]{"BB101", "Chiến thuật Trung đội Bộ binh Tiến công & Phòng ngự", "4", "60", "1", "Môn học phần", "Diễn tập chiến thuật", "1", "Khoa Binh chủng"});
            list.add(new String[]{"BB102", "Sử dụng Hỏa lực Bộ binh (B40, B41, RPD)", "3", "45", "1", "Môn học phần", "Thực hành bắn đạn thật", "1", "Khoa Binh chủng"});
            list.add(new String[]{"BB103", "Tổ chức Chỉ huy Phân đội Bộ binh", "3", "45", "1", "Môn học phần", "Bài tập chỉ huy", "1", "Khoa Binh chủng"});
        }

        // 3 Môn thi tốt nghiệp chuẩn
        list.add(new String[]{"TN01", "Thi Tốt nghiệp môn Chính trị", "2", "30", "1", "Môn thi tốt nghiệp", "Vấn đáp lý thuyết", "1", "Khoa Chính trị"});
        list.add(new String[]{"TN02", "Thi Tốt nghiệp môn Quân sự chung", "3", "45", "1", "Môn thi tốt nghiệp", "Thực hành thao trường", "2", "Khoa Quân sự chung"});
        list.add(new String[]{"TN03", "Thi Tốt nghiệp môn Chuyên ngành", "4", "60", "1", "Môn thi tốt nghiệp", "Thực hành chuyên ngành tác chiến", "2", "Khoa Binh chủng"});

        return list;
    }

    @Transactional
    public Map<String, Object> importCurriculumFromExcel(MultipartFile file) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            // Read metadata from row 2 (e.g. "ĐỐI TƯỢNG: SQDB | CHUYÊN NGÀNH: TRINH SÁT BỘ BINH (TSBB)")
            String subTitle = "";
            Row r2 = sheet.getRow(2);
            if (r2 != null && r2.getCell(0) != null) {
                subTitle = getCellValueAsString(r2.getCell(0));
            }

            String majorCode = "TSBB";
            if (subTitle.contains("(") && subTitle.contains(")")) {
                majorCode = subTitle.substring(subTitle.lastIndexOf("(") + 1, subTitle.lastIndexOf(")")).trim();
            }

            Major major = majorRepository.findByCode(majorCode).orElseGet(() ->
                    majorRepository.findAll().stream().findFirst().orElse(null));

            if (major == null) {
                throw new IllegalArgumentException("Không xác định được chuyên ngành từ file Excel!");
            }

            Course course = courseRepository.findByCode("SQDB2026").orElseGet(() ->
                    courseRepository.findAll().stream().findFirst().orElse(null));

            Curriculum curriculum = curriculumRepository.findByMajorIdAndCourseId(major.getId(), course.getId())
                    .orElseGet(() -> curriculumRepository.save(Curriculum.builder()
                            .major(major)
                            .course(course)
                            .name("Lộ trình Đào tạo & Thi TN " + major.getName())
                            .totalCredits(0)
                            .build()));

            Department dept = departmentRepository.findAll().stream().findFirst().orElse(null);

            int importedCount = 0;
            int totalCredits = 0;

            for (int r = 5; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                String code = getCellValueAsString(row.getCell(1));
                String name = getCellValueAsString(row.getCell(2));
                if (code.isBlank() || name.isBlank()) continue;

                int credits = 3;
                try {
                    String credStr = getCellValueAsString(row.getCell(3));
                    if (!credStr.isBlank()) credits = Integer.parseInt(credStr);
                } catch (Exception ignored) {}

                int semester = 1;
                try {
                    String semStr = getCellValueAsString(row.getCell(5));
                    if (!semStr.isBlank()) semester = Integer.parseInt(semStr);
                } catch (Exception ignored) {}

                final int finalCredits = credits;
                Subject subject = subjectRepository.findByCode(code).orElseGet(() ->
                        subjectRepository.save(Subject.builder()
                                .code(code)
                                .name(name)
                                .credits(finalCredits)
                                .department(dept)
                                .build()));

                if (curriculumSubjectRepository.findByCurriculumIdAndSubjectId(curriculum.getId(), subject.getId()).isEmpty()) {
                    curriculumSubjectRepository.save(CurriculumSubject.builder()
                            .curriculum(curriculum)
                            .subject(subject)
                            .semester(semester)
                            .isCompulsory(true)
                            .build());
                }

                importedCount++;
                totalCredits += credits;
            }

            curriculum.setTotalCredits(totalCredits);
            curriculumRepository.save(curriculum);

            return Map.of(
                    "success", true,
                    "message", "Đã nạp thành công " + importedCount + " môn học & nội dung thi vào Lộ trình đào tạo!",
                    "importedCount", importedCount,
                    "majorName", major.getName(),
                    "majorCode", major.getCode(),
                    "totalCredits", totalCredits
            );
        }
    }
}
