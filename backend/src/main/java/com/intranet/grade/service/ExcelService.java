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
}
