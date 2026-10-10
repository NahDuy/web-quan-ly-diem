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

    private static class HocPhanStyles {
        CellStyle agencyStyle;
        CellStyle agencyUnderlineStyle;
        CellStyle titleStyle;
        CellStyle subTitleStyle;
        CellStyle italicCenterStyle;
        CellStyle headerBoldStyle;
        CellStyle verticalSubjectHeaderStyle;
        CellStyle dataCenterStyle;
        CellStyle dataLeftStyle;
        CellStyle dataCenterBold;
    }

    private static class TotNghiepStyles {
        CellStyle agencyStyle;
        CellStyle agencyUnderlineStyle;
        CellStyle titleStyle;
        CellStyle subTitleStyle;
        CellStyle italicCenterStyle;
        CellStyle italicRightBoldStyle;
        CellStyle headerBoldStyle;
        CellStyle dataCenterStyle;
        CellStyle dataLeftStyle;
        CellStyle dataCenterBold;
    }

    private String getUniqueSheetName(String desiredName, Set<String> existingNames) {
        if (desiredName == null || desiredName.trim().isEmpty()) {
            desiredName = "Lop";
        }
        String cleanName = desiredName.replaceAll("[\\\\/\u003F\u002A\\[\\]:]", "_").trim();
        if (cleanName.length() > 30) {
            cleanName = cleanName.substring(0, 30);
        }
        String finalName = cleanName;
        int counter = 1;
        while (existingNames.contains(finalName.toLowerCase())) {
            String suffix = "_" + counter;
            int maxBaseLen = 31 - suffix.length();
            if (cleanName.length() > maxBaseLen) {
                finalName = cleanName.substring(0, maxBaseLen) + suffix;
            } else {
                finalName = cleanName + suffix;
            }
            counter++;
        }
        existingNames.add(finalName.toLowerCase());
        return finalName;
    }

    private HocPhanStyles createHocPhanStyles(Workbook workbook) {
        HocPhanStyles styles = new HocPhanStyles();

        Font agencyFont = workbook.createFont();
        agencyFont.setBold(true);
        agencyFont.setFontHeightInPoints((short) 12);
        agencyFont.setFontName("Times New Roman");

        Font agencyUnderlineFont = workbook.createFont();
        agencyUnderlineFont.setBold(true);
        agencyUnderlineFont.setUnderline(Font.U_SINGLE);
        agencyUnderlineFont.setFontHeightInPoints((short) 12);
        agencyUnderlineFont.setFontName("Times New Roman");

        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleFont.setFontName("Times New Roman");

        Font subTitleFont = workbook.createFont();
        subTitleFont.setBold(true);
        subTitleFont.setFontHeightInPoints((short) 13);
        subTitleFont.setFontName("Times New Roman");

        Font italicFont = workbook.createFont();
        italicFont.setItalic(true);
        italicFont.setFontHeightInPoints((short) 12);
        italicFont.setFontName("Times New Roman");

        Font headerBoldFont = workbook.createFont();
        headerBoldFont.setBold(true);
        headerBoldFont.setFontHeightInPoints((short) 12);
        headerBoldFont.setFontName("Times New Roman");

        Font subjectNameFont = workbook.createFont();
        subjectNameFont.setBold(false);
        subjectNameFont.setFontHeightInPoints((short) 11);
        subjectNameFont.setFontName("Times New Roman");

        Font dataFont = workbook.createFont();
        dataFont.setFontHeightInPoints((short) 12);
        dataFont.setFontName("Times New Roman");

        Font boldDataFont = workbook.createFont();
        boldDataFont.setBold(true);
        boldDataFont.setFontHeightInPoints((short) 12);
        boldDataFont.setFontName("Times New Roman");

        styles.agencyStyle = workbook.createCellStyle();
        styles.agencyStyle.setFont(agencyFont);
        styles.agencyStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.agencyStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.agencyUnderlineStyle = workbook.createCellStyle();
        styles.agencyUnderlineStyle.setFont(agencyUnderlineFont);
        styles.agencyUnderlineStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.agencyUnderlineStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.titleStyle = workbook.createCellStyle();
        styles.titleStyle.setFont(titleFont);
        styles.titleStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.subTitleStyle = workbook.createCellStyle();
        styles.subTitleStyle.setFont(subTitleFont);
        styles.subTitleStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.subTitleStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.italicCenterStyle = workbook.createCellStyle();
        styles.italicCenterStyle.setFont(italicFont);
        styles.italicCenterStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.italicCenterStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.headerBoldStyle = workbook.createCellStyle();
        styles.headerBoldStyle.setFont(headerBoldFont);
        styles.headerBoldStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.headerBoldStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.headerBoldStyle.setBorderTop(BorderStyle.THIN);
        styles.headerBoldStyle.setBorderBottom(BorderStyle.THIN);
        styles.headerBoldStyle.setBorderLeft(BorderStyle.THIN);
        styles.headerBoldStyle.setBorderRight(BorderStyle.THIN);
        styles.headerBoldStyle.setWrapText(true);

        styles.verticalSubjectHeaderStyle = workbook.createCellStyle();
        styles.verticalSubjectHeaderStyle.setFont(subjectNameFont);
        styles.verticalSubjectHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.verticalSubjectHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.verticalSubjectHeaderStyle.setBorderTop(BorderStyle.THIN);
        styles.verticalSubjectHeaderStyle.setBorderBottom(BorderStyle.THIN);
        styles.verticalSubjectHeaderStyle.setBorderLeft(BorderStyle.THIN);
        styles.verticalSubjectHeaderStyle.setBorderRight(BorderStyle.THIN);
        styles.verticalSubjectHeaderStyle.setRotation((short) 90);
        styles.verticalSubjectHeaderStyle.setWrapText(true);

        styles.dataCenterStyle = workbook.createCellStyle();
        styles.dataCenterStyle.setFont(dataFont);
        styles.dataCenterStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.dataCenterStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.dataCenterStyle.setBorderTop(BorderStyle.THIN);
        styles.dataCenterStyle.setBorderBottom(BorderStyle.THIN);
        styles.dataCenterStyle.setBorderLeft(BorderStyle.THIN);
        styles.dataCenterStyle.setBorderRight(BorderStyle.THIN);

        styles.dataLeftStyle = workbook.createCellStyle();
        styles.dataLeftStyle.setFont(dataFont);
        styles.dataLeftStyle.setAlignment(HorizontalAlignment.LEFT);
        styles.dataLeftStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.dataLeftStyle.setBorderTop(BorderStyle.THIN);
        styles.dataLeftStyle.setBorderBottom(BorderStyle.THIN);
        styles.dataLeftStyle.setBorderLeft(BorderStyle.THIN);
        styles.dataLeftStyle.setBorderRight(BorderStyle.THIN);

        styles.dataCenterBold = workbook.createCellStyle();
        styles.dataCenterBold.setFont(boldDataFont);
        styles.dataCenterBold.setAlignment(HorizontalAlignment.CENTER);
        styles.dataCenterBold.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.dataCenterBold.setBorderTop(BorderStyle.THIN);
        styles.dataCenterBold.setBorderBottom(BorderStyle.THIN);
        styles.dataCenterBold.setBorderLeft(BorderStyle.THIN);
        styles.dataCenterBold.setBorderRight(BorderStyle.THIN);

        return styles;
    }

    private TotNghiepStyles createTotNghiepStyles(Workbook workbook) {
        TotNghiepStyles styles = new TotNghiepStyles();

        Font agencyFont = workbook.createFont();
        agencyFont.setBold(true);
        agencyFont.setFontHeightInPoints((short) 12);
        agencyFont.setFontName("Times New Roman");

        Font agencyUnderlineFont = workbook.createFont();
        agencyUnderlineFont.setBold(true);
        agencyUnderlineFont.setUnderline(Font.U_SINGLE);
        agencyUnderlineFont.setFontHeightInPoints((short) 12);
        agencyUnderlineFont.setFontName("Times New Roman");

        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleFont.setFontName("Times New Roman");

        Font subTitleFont = workbook.createFont();
        subTitleFont.setBold(true);
        subTitleFont.setFontHeightInPoints((short) 13);
        subTitleFont.setFontName("Times New Roman");

        Font italicFont = workbook.createFont();
        italicFont.setItalic(true);
        italicFont.setFontHeightInPoints((short) 12);
        italicFont.setFontName("Times New Roman");

        Font italicBoldFont = workbook.createFont();
        italicBoldFont.setBold(true);
        italicBoldFont.setItalic(true);
        italicBoldFont.setFontHeightInPoints((short) 12);
        italicBoldFont.setFontName("Times New Roman");

        Font headerBoldFont = workbook.createFont();
        headerBoldFont.setBold(true);
        headerBoldFont.setFontHeightInPoints((short) 12);
        headerBoldFont.setFontName("Times New Roman");

        Font dataFont = workbook.createFont();
        dataFont.setFontHeightInPoints((short) 12);
        dataFont.setFontName("Times New Roman");

        Font boldDataFont = workbook.createFont();
        boldDataFont.setBold(true);
        boldDataFont.setFontHeightInPoints((short) 12);
        boldDataFont.setFontName("Times New Roman");

        styles.agencyStyle = workbook.createCellStyle();
        styles.agencyStyle.setFont(agencyFont);
        styles.agencyStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.agencyStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.agencyUnderlineStyle = workbook.createCellStyle();
        styles.agencyUnderlineStyle.setFont(agencyUnderlineFont);
        styles.agencyUnderlineStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.agencyUnderlineStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.titleStyle = workbook.createCellStyle();
        styles.titleStyle.setFont(titleFont);
        styles.titleStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.subTitleStyle = workbook.createCellStyle();
        styles.subTitleStyle.setFont(subTitleFont);
        styles.subTitleStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.subTitleStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.italicCenterStyle = workbook.createCellStyle();
        styles.italicCenterStyle.setFont(italicFont);
        styles.italicCenterStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.italicCenterStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.italicRightBoldStyle = workbook.createCellStyle();
        styles.italicRightBoldStyle.setFont(italicBoldFont);
        styles.italicRightBoldStyle.setAlignment(HorizontalAlignment.RIGHT);
        styles.italicRightBoldStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        styles.headerBoldStyle = workbook.createCellStyle();
        styles.headerBoldStyle.setFont(headerBoldFont);
        styles.headerBoldStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.headerBoldStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.headerBoldStyle.setBorderTop(BorderStyle.THIN);
        styles.headerBoldStyle.setBorderBottom(BorderStyle.THIN);
        styles.headerBoldStyle.setBorderLeft(BorderStyle.THIN);
        styles.headerBoldStyle.setBorderRight(BorderStyle.THIN);
        styles.headerBoldStyle.setWrapText(true);

        styles.dataCenterStyle = workbook.createCellStyle();
        styles.dataCenterStyle.setFont(dataFont);
        styles.dataCenterStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.dataCenterStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.dataCenterStyle.setBorderTop(BorderStyle.THIN);
        styles.dataCenterStyle.setBorderBottom(BorderStyle.THIN);
        styles.dataCenterStyle.setBorderLeft(BorderStyle.THIN);
        styles.dataCenterStyle.setBorderRight(BorderStyle.THIN);

        styles.dataLeftStyle = workbook.createCellStyle();
        styles.dataLeftStyle.setFont(dataFont);
        styles.dataLeftStyle.setAlignment(HorizontalAlignment.LEFT);
        styles.dataLeftStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.dataLeftStyle.setBorderTop(BorderStyle.THIN);
        styles.dataLeftStyle.setBorderBottom(BorderStyle.THIN);
        styles.dataLeftStyle.setBorderLeft(BorderStyle.THIN);
        styles.dataLeftStyle.setBorderRight(BorderStyle.THIN);

        styles.dataCenterBold = workbook.createCellStyle();
        styles.dataCenterBold.setFont(boldDataFont);
        styles.dataCenterBold.setAlignment(HorizontalAlignment.CENTER);
        styles.dataCenterBold.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.dataCenterBold.setBorderTop(BorderStyle.THIN);
        styles.dataCenterBold.setBorderBottom(BorderStyle.THIN);
        styles.dataCenterBold.setBorderLeft(BorderStyle.THIN);
        styles.dataCenterBold.setBorderRight(BorderStyle.THIN);

        return styles;
    }

    private void buildHocPhanSheet(Workbook workbook, MatrixResponseDTO matrix, ClassEntity clazz, HocPhanStyles styles, Set<String> existingSheetNames) {
        String majorName = clazz != null && clazz.getMajor() != null ? clazz.getMajor().getName() : (matrix.getMajorName() != null ? matrix.getMajorName() : "Sĩ quan Dự bị");
        String courseName = clazz != null && clazz.getCourse() != null ? clazz.getCourse().getName() : (matrix.getCourseName() != null ? matrix.getCourseName() : "Khóa 2026");
        String className = clazz != null ? clazz.getName() : matrix.getClassName();
        String classCode = matrix.getClassCode() != null ? matrix.getClassCode() : (clazz != null && clazz.getCode() != null ? clazz.getCode() : "Lop");

        String sheetName = getUniqueSheetName(classCode, existingSheetNames);
        Sheet sheet = workbook.createSheet(sheetName);

        sheet.getPrintSetup().setLandscape(true);
        sheet.getPrintSetup().setPaperSize(PrintSetup.A4_PAPERSIZE);

        int numSubjects = matrix.getColumns() != null ? matrix.getColumns().size() : 0;
        int totalCols = Math.max(8, 5 + numSubjects + 3);

        // Row 0: QUÂN KHU 3
        Row r0 = sheet.createRow(0);
        r0.setHeightInPoints(22);
        Cell cAgency1 = r0.createCell(0);
        cAgency1.setCellValue("QUÂN KHU 3");
        cAgency1.setCellStyle(styles.agencyStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));

        // Row 1: TRƯỜNG QUÂN SỰ
        Row r1 = sheet.createRow(1);
        r1.setHeightInPoints(22);
        Cell cAgency2 = r1.createCell(0);
        cAgency2.setCellValue("TRƯỜNG QUÂN SỰ");
        cAgency2.setCellStyle(styles.agencyUnderlineStyle);
        sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 2));

        // Row 2: Tiêu đề chính IN ĐẬM
        Row r2 = sheet.createRow(2);
        r2.setHeightInPoints(30);
        Cell cTitle = r2.createCell(0);
        cTitle.setCellValue("KẾT QUẢ KIỂM TRA THƯỜNG XUYÊN");
        cTitle.setCellStyle(styles.titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, totalCols - 1));

        // Row 3: Đơn vị lớp IN ĐẬM
        Row r3 = sheet.createRow(3);
        r3.setHeightInPoints(24);
        Cell cUnit = r3.createCell(0);
        cUnit.setCellValue("Đơn vị: " + className + " - Đào tạo " + majorName + " - " + courseName);
        cUnit.setCellStyle(styles.subTitleStyle);
        sheet.addMergedRegion(new CellRangeAddress(3, 3, 0, totalCols - 1));

        // Row 4: Quyết định kèm theo
        Row r4 = sheet.createRow(4);
        r4.setHeightInPoints(20);
        Cell cDec = r4.createCell(0);
        cDec.setCellValue("(Kèm theo Quyết định số:            /QĐ-HT ngày      tháng 5 năm 2026)");
        cDec.setCellStyle(styles.italicCenterStyle);
        sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, totalCols - 1));

        // Row 5: Khai giảng / Bế giảng
        Row r5 = sheet.createRow(5);
        r5.setHeightInPoints(20);
        Cell cDates = r5.createCell(0);
        cDates.setCellValue("Khai giảng: 18/6/2026         Bế giảng : 18/10/2026");
        cDates.setCellStyle(styles.italicCenterStyle);
        sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, totalCols - 1));

        // Table Headers at Row 7 & Row 8 (0-indexed)
        Row headRow1 = sheet.createRow(7);
        Row headRow2 = sheet.createRow(8);
        headRow1.setHeightInPoints(34);
        headRow2.setHeightInPoints(210);

        // Col 0: TT (IN ĐẬM)
        Cell cTT1 = headRow1.createCell(0);
        cTT1.setCellValue("TT");
        cTT1.setCellStyle(styles.headerBoldStyle);
        headRow2.createCell(0).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(7, 8, 0, 0));

        // Col 1-2: Số vào sổ (IN ĐẬM)
        Cell cCode1 = headRow1.createCell(1);
        cCode1.setCellValue("Số vào sổ");
        cCode1.setCellStyle(styles.headerBoldStyle);
        headRow1.createCell(2).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(7, 7, 1, 2));

        Cell cCodeSub1 = headRow2.createCell(1);
        cCodeSub1.setCellValue("Mã HV");
        cCodeSub1.setCellStyle(styles.headerBoldStyle);

        Cell cCodeSub2 = headRow2.createCell(2);
        cCodeSub2.setCellValue("Khóa");
        cCodeSub2.setCellStyle(styles.headerBoldStyle);

        // Col 3: Họ và tên (IN ĐẬM)
        Cell cName1 = headRow1.createCell(3);
        cName1.setCellValue("Họ và tên");
        cName1.setCellStyle(styles.headerBoldStyle);
        headRow2.createCell(3).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(7, 8, 3, 3));

        // Col 4: Ngày tháng năm sinh (IN ĐẬM)
        Cell cDob1 = headRow1.createCell(4);
        cDob1.setCellValue("Ngày tháng\nnăm sinh");
        cDob1.setCellStyle(styles.headerBoldStyle);
        headRow2.createCell(4).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(7, 8, 4, 4));

        // Nhóm: Kết quả kiểm tra thường xuyên = {N} (IN ĐẬM)
        int subStart = 5;
        int subEnd = subStart + numSubjects - 1;
        if (numSubjects > 0) {
            Cell subGroupCell = headRow1.createCell(subStart);
            subGroupCell.setCellValue("Kết quả kiểm tra thường xuyên =" + numSubjects);
            subGroupCell.setCellStyle(styles.headerBoldStyle);
            for (int c = subStart + 1; c <= subEnd; c++) {
                headRow1.createCell(c).setCellStyle(styles.headerBoldStyle);
            }
            if (subEnd > subStart) {
                sheet.addMergedRegion(new CellRangeAddress(7, 7, subStart, subEnd));
            }

            for (int i = 0; i < numSubjects; i++) {
                SubjectColumnDTO sub = matrix.getColumns().get(i);
                int col = subStart + i;
                Cell sc = headRow2.createCell(col);
                sc.setCellValue(sub.getSubjectName());
                sc.setCellStyle(styles.verticalSubjectHeaderStyle);
            }
        }

        int afterStart = Math.max(subEnd + 1, 5);
        String[] fixedAfter = {"Trung bình\ncộng", "Phân loại\nrèn luyện", "Quê quán"};
        for (int i = 0; i < fixedAfter.length; i++) {
            int col = afterStart + i;
            Cell c = headRow1.createCell(col);
            c.setCellValue(fixedAfter[i]);
            c.setCellStyle(styles.headerBoldStyle);
            headRow2.createCell(col).setCellStyle(styles.headerBoldStyle);
            sheet.addMergedRegion(new CellRangeAddress(7, 8, col, col));
        }

        // Data Rows (from r=9)
        int curRow = 9;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        if (matrix.getRows() != null) {
            for (StudentRowDTO st : matrix.getRows()) {
                Row r = sheet.createRow(curRow++);
                r.setHeightInPoints(24);

                int cIdx = 0;
                Cell cellTT = r.createCell(cIdx++);
                cellTT.setCellValue(st.getStt());
                cellTT.setCellStyle(styles.dataCenterStyle);

                Cell cellCode = r.createCell(cIdx++);
                cellCode.setCellValue(st.getStudentCode());
                cellCode.setCellStyle(styles.dataCenterStyle);

                Cell cellYear = r.createCell(cIdx++);
                cellYear.setCellValue(2026);
                cellYear.setCellStyle(styles.dataCenterStyle);

                Cell cellName = r.createCell(cIdx++);
                cellName.setCellValue(st.getFullName());
                cellName.setCellStyle(styles.dataLeftStyle);

                Cell cellDob = r.createCell(cIdx++);
                cellDob.setCellValue(st.getDob() != null ? st.getDob().format(formatter) : "");
                cellDob.setCellStyle(styles.dataCenterStyle);

                if (matrix.getColumns() != null) {
                    for (SubjectColumnDTO sub : matrix.getColumns()) {
                        Cell cScore = r.createCell(cIdx++);
                        cScore.setCellStyle(styles.dataCenterStyle);
                        if (st.getGrades() != null && st.getGrades().containsKey(sub.getSubjectId())) {
                            BigDecimal sc = st.getGrades().get(sub.getSubjectId()).getScore();
                            if (sc != null) cScore.setCellValue(sc.doubleValue());
                        }
                    }
                }

                Cell cTbc = r.createCell(cIdx++);
                cTbc.setCellStyle(styles.dataCenterBold);
                if (st.getTbcScore() != null) cTbc.setCellValue(st.getTbcScore().doubleValue());

                Cell cCond = r.createCell(cIdx++);
                cCond.setCellValue(formatConductGrade(st.getConductGrade()));
                cCond.setCellStyle(styles.dataCenterStyle);

                Cell cPob = r.createCell(cIdx++);
                cPob.setCellValue(st.getPob() != null ? st.getPob() : "");
                cPob.setCellStyle(styles.dataLeftStyle);
            }
        }

        // Summary / Signatures
        int signRowIdx = curRow + 2;
        Row signRow1 = sheet.createRow(signRowIdx);
        Row signRow2 = sheet.createRow(signRowIdx + 1);
        signRow1.setHeightInPoints(24);
        signRow2.setHeightInPoints(20);

        Cell s1 = signRow1.createCell(1);
        s1.setCellValue("NGƯỜI LẬP BIỂU");
        s1.setCellStyle(styles.agencyStyle);

        Cell s1Note = signRow2.createCell(1);
        s1Note.setCellValue("(Ký và ghi rõ họ tên)");
        s1Note.setCellStyle(styles.italicCenterStyle);

        int midCol = totalCols / 2;
        Cell s2 = signRow1.createCell(midCol);
        s2.setCellValue("TRƯỞNG BỘ MÔN / KHOA");
        s2.setCellStyle(styles.agencyStyle);

        Cell s2Note = signRow2.createCell(midCol);
        s2Note.setCellValue("(Ký và ghi rõ họ tên)");
        s2Note.setCellStyle(styles.italicCenterStyle);

        int endCol = Math.max(totalCols - 2, midCol + 2);
        Cell s3 = signRow1.createCell(endCol);
        s3.setCellValue("CHỈ HUY ĐƠN VỊ");
        s3.setCellStyle(styles.agencyStyle);

        Cell s3Note = signRow2.createCell(endCol);
        s3Note.setCellValue("(Ký và ghi rõ họ tên)");
        s3Note.setCellStyle(styles.italicCenterStyle);

        // Column Widths
        sheet.setColumnWidth(0, 5 * 256);  // TT
        sheet.setColumnWidth(1, 14 * 256); // Mã HV
        sheet.setColumnWidth(2, 8 * 256);  // Khóa
        sheet.setColumnWidth(3, 24 * 256); // Họ tên
        sheet.setColumnWidth(4, 14 * 256); // Ngày sinh
        for (int i = 0; i < numSubjects; i++) {
            sheet.setColumnWidth(subStart + i, 13 * 256);
        }
        sheet.setColumnWidth(afterStart, 14 * 256);     // Trung bình cộng
        sheet.setColumnWidth(afterStart + 1, 16 * 256); // Phân loại rèn luyện
        sheet.setColumnWidth(afterStart + 2, 28 * 256); // Quê quán
    }

    public byte[] exportKetQuaHocPhanExcel(Integer classId, Integer semester) throws IOException {
        MatrixResponseDTO matrix = gradeMatrixService.getClassMatrix(classId, semester);
        ClassEntity clazz = classRepository.findById(classId).orElse(null);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            HocPhanStyles styles = createHocPhanStyles(workbook);
            Set<String> existingNames = new HashSet<>();
            buildHocPhanSheet(workbook, matrix, clazz, styles, existingNames);
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportAllClassesHocPhanExcel(Integer semester) throws IOException {
        List<ClassEntity> classes = classRepository.findAll();
        classes.sort((a, b) -> (a.getCode() != null ? a.getCode() : "").compareToIgnoreCase(b.getCode() != null ? b.getCode() : ""));

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            HocPhanStyles styles = createHocPhanStyles(workbook);
            Set<String> existingNames = new HashSet<>();

            if (classes.isEmpty()) {
                workbook.createSheet("DanhSachLop");
            } else {
                for (ClassEntity c : classes) {
                    MatrixResponseDTO matrix = gradeMatrixService.getClassMatrix(c.getId(), semester);
                    buildHocPhanSheet(workbook, matrix, c, styles, existingNames);
                }
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void buildTotNghiepSheet(Workbook workbook, MatrixResponseDTO matrix, ClassEntity clazz, TotNghiepStyles styles, Set<String> existingSheetNames) {
        String majorName = clazz != null && clazz.getMajor() != null ? clazz.getMajor().getName() : (matrix.getMajorName() != null ? matrix.getMajorName() : "Sĩ quan Dự bị");
        String courseName = clazz != null && clazz.getCourse() != null ? clazz.getCourse().getName() : (matrix.getCourseName() != null ? matrix.getCourseName() : "Khóa 2026");
        String className = clazz != null ? clazz.getName() : matrix.getClassName();
        String classCode = matrix.getClassCode() != null ? matrix.getClassCode() : (clazz != null && clazz.getCode() != null ? clazz.getCode() : "Lop");

        String sheetName = getUniqueSheetName(classCode, existingSheetNames);
        Sheet sheet = workbook.createSheet(sheetName);

        sheet.getPrintSetup().setLandscape(true);
        sheet.getPrintSetup().setPaperSize(PrintSetup.A4_PAPERSIZE);

        int totalCols = 14;

        // Row 0: QUÂN KHU 3
        Row r0 = sheet.createRow(0);
        r0.setHeightInPoints(22);
        Cell cAgency1 = r0.createCell(0);
        cAgency1.setCellValue("QUÂN KHU 3");
        cAgency1.setCellStyle(styles.agencyStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));

        // Row 1: TRƯỜNG QUÂN SỰ
        Row r1 = sheet.createRow(1);
        r1.setHeightInPoints(22);
        Cell cAgency2 = r1.createCell(0);
        cAgency2.setCellValue("TRƯỜNG QUÂN SỰ");
        cAgency2.setCellStyle(styles.agencyUnderlineStyle);
        sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 2));

        // Row 2: Tiêu đề chính IN ĐẬM
        Row r2 = sheet.createRow(2);
        r2.setHeightInPoints(30);
        Cell cTitle = r2.createCell(0);
        cTitle.setCellValue("KẾT QUẢ PHÂN LOẠI TỐT NGHIỆP");
        cTitle.setCellStyle(styles.titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, totalCols - 1));

        // Row 3: Khóa & Lớp đào tạo IN ĐẬM
        Row r3 = sheet.createRow(3);
        r3.setHeightInPoints(24);
        Cell cSub = r3.createCell(0);
        cSub.setCellValue("Khóa " + courseName + " - Đào tạo " + majorName + " (" + className + ")");
        cSub.setCellStyle(styles.subTitleStyle);
        sheet.addMergedRegion(new CellRangeAddress(3, 3, 0, totalCols - 1));

        // Row 4: Quyết định kèm theo
        Row r4 = sheet.createRow(4);
        r4.setHeightInPoints(20);
        Cell cDec = r4.createCell(0);
        cDec.setCellValue("(Kèm theo Quyết định số:            /QĐ-TQS ngày       tháng 4 năm 2026 của Trường Quân sự)");
        cDec.setCellStyle(styles.italicCenterStyle);
        sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, totalCols - 1));

        // Row 5: Ngày tiếp nhận, khai giảng, bế giảng
        Row r5 = sheet.createRow(5);
        r5.setHeightInPoints(20);
        Cell cDate = r5.createCell(0);
        cDate.setCellValue("Tiếp nhận 03/02/2026    Khai giảng: 05/02/2026    Bế giảng : 29/5/2026");
        cDate.setCellStyle(styles.italicCenterStyle);
        sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, totalCols - 1));

        // Row 7: Quân số lớp IN ĐẬM NGHIÊNG
        int numRows = matrix.getRows() != null ? matrix.getRows().size() : 0;
        Row r7 = sheet.createRow(7);
        r7.setHeightInPoints(22);
        Cell cCount = r7.createCell(totalCols - 1);
        cCount.setCellValue(className + ": " + numRows + " đ/c");
        cCount.setCellStyle(styles.italicRightBoldStyle);

        // Row 9 & 10: Table Headers (0-indexed: r=9, r=10)
        Row hRow1 = sheet.createRow(9);
        Row hRow2 = sheet.createRow(10);
        hRow1.setHeightInPoints(34);
        hRow2.setHeightInPoints(36);

        // C0: TT (IN ĐẬM)
        Cell cTT1 = hRow1.createCell(0);
        cTT1.setCellValue("TT");
        cTT1.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(0).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 0, 0));

        // C1-C2: Số vào sổ gốc cấp chứng chỉ (IN ĐẬM)
        Cell cCert = hRow1.createCell(1);
        cCert.setCellValue("Số vào sổ gốc cấp chứng chỉ");
        cCert.setCellStyle(styles.headerBoldStyle);
        hRow1.createCell(2).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 9, 1, 2));

        Cell cCertSub1 = hRow2.createCell(1);
        cCertSub1.setCellValue("Số TT");
        cCertSub1.setCellStyle(styles.headerBoldStyle);

        Cell cCertSub2 = hRow2.createCell(2);
        cCertSub2.setCellValue("Năm");
        cCertSub2.setCellStyle(styles.headerBoldStyle);

        // C3: Họ và tên (IN ĐẬM)
        Cell cName1 = hRow1.createCell(3);
        cName1.setCellValue("Họ và tên");
        cName1.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(3).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 3, 3));

        // C4: Ngày tháng năm sinh (IN ĐẬM)
        Cell cDob1 = hRow1.createCell(4);
        cDob1.setCellValue("Ngày tháng\nnăm sinh");
        cDob1.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(4).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 4, 4));

        // C5-C8: Nhóm Kết quả thi (IN ĐẬM)
        Cell cExamGroup = hRow1.createCell(5);
        cExamGroup.setCellValue("Kết quả thi");
        cExamGroup.setCellStyle(styles.headerBoldStyle);
        for (int col = 6; col <= 8; col++) {
            hRow1.createCell(col).setCellStyle(styles.headerBoldStyle);
        }
        sheet.addMergedRegion(new CellRangeAddress(9, 9, 5, 8));

        String[] examSubs = {"CTĐ,\nCTCT", "Kỹ,\nC.thuật", "Chuyên\nngành", "TB thi"};
        for (int i = 0; i < examSubs.length; i++) {
            Cell subC = hRow2.createCell(5 + i);
            subC.setCellValue(examSubs[i]);
            subC.setCellStyle(styles.headerBoldStyle);
        }

        // C9: Học lực (TB học tập) (IN ĐẬM)
        Cell cHocLuc = hRow1.createCell(9);
        cHocLuc.setCellValue("Học lực\n(TB học tập)");
        cHocLuc.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(9).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 9, 9));

        // C10: TB khóa học (Xét TN) (IN ĐẬM)
        Cell cTbKhoa = hRow1.createCell(10);
        cTbKhoa.setCellValue("TB khóa\nhọc (Xét TN)");
        cTbKhoa.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(10).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 10, 10));

        // C11: Rèn luyện (IN ĐẬM)
        Cell cRenLuyen = hRow1.createCell(11);
        cRenLuyen.setCellValue("Rèn\nluyện");
        cRenLuyen.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(11).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 11, 11));

        // C12: Phân loại TN (IN ĐẬM)
        Cell cPhanLoai = hRow1.createCell(12);
        cPhanLoai.setCellValue("Phân loại\nTN");
        cPhanLoai.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(12).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 12, 12));

        // C13: Quê quán (IN ĐẬM)
        Cell cQueQuan = hRow1.createCell(13);
        cQueQuan.setCellValue("Quê quán");
        cQueQuan.setCellStyle(styles.headerBoldStyle);
        hRow2.createCell(13).setCellStyle(styles.headerBoldStyle);
        sheet.addMergedRegion(new CellRangeAddress(9, 10, 13, 13));

        // Data Rows (from r=11)
        int curRow = 11;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        int countGioi = 0, countKha = 0, countTbKha = 0, countTb = 0;

        if (matrix.getRows() != null) {
            for (StudentRowDTO st : matrix.getRows()) {
                Row r = sheet.createRow(curRow++);
                r.setHeightInPoints(24);

                Cell d0 = r.createCell(0);
                d0.setCellValue(st.getStt());
                d0.setCellStyle(styles.dataCenterStyle);

                Cell d1 = r.createCell(1);
                d1.setCellValue(String.format("%04d", st.getStt()));
                d1.setCellStyle(styles.dataCenterStyle);

                Cell d2 = r.createCell(2);
                d2.setCellValue(2026);
                d2.setCellStyle(styles.dataCenterStyle);

                Cell d3 = r.createCell(3);
                d3.setCellValue(st.getFullName());
                d3.setCellStyle(styles.dataLeftStyle);

                Cell d4 = r.createCell(4);
                d4.setCellValue(st.getDob() != null ? st.getDob().format(formatter) : "");
                d4.setCellStyle(styles.dataCenterStyle);

                Cell d5 = r.createCell(5);
                d5.setCellStyle(styles.dataCenterStyle);
                if (st.getGradExamScores() != null && st.getGradExamScores().containsKey(101)) {
                    d5.setCellValue(st.getGradExamScores().get(101).doubleValue());
                }

                Cell d6 = r.createCell(6);
                d6.setCellStyle(styles.dataCenterStyle);
                if (st.getGradExamScores() != null && st.getGradExamScores().containsKey(102)) {
                    d6.setCellValue(st.getGradExamScores().get(102).doubleValue());
                }

                Cell d7 = r.createCell(7);
                d7.setCellStyle(styles.dataCenterStyle);
                if (st.getGradExamScores() != null && st.getGradExamScores().containsKey(103)) {
                    d7.setCellValue(st.getGradExamScores().get(103).doubleValue());
                }

                Cell d8 = r.createCell(8);
                d8.setCellStyle(styles.dataCenterBold);
                if (st.getGraduationExamScore() != null) {
                    d8.setCellValue(st.getGraduationExamScore().doubleValue());
                }

                Cell d9 = r.createCell(9);
                d9.setCellStyle(styles.dataCenterBold);
                if (st.getTbcScore() != null) {
                    d9.setCellValue(st.getTbcScore().doubleValue());
                }

                Cell d10 = r.createCell(10);
                d10.setCellStyle(styles.dataCenterBold);
                if (st.getFinalGraduationScore() != null) {
                    d10.setCellValue(st.getFinalGraduationScore().doubleValue());
                }

                String rl = formatConductGrade(st.getConductGrade());
                Cell d11 = r.createCell(11);
                d11.setCellValue(rl);
                d11.setCellStyle(styles.dataCenterStyle);

                String pl = formatClassification(st.getGraduationClassification());
                Cell d12 = r.createCell(12);
                d12.setCellValue(pl);
                d12.setCellStyle(styles.dataCenterBold);

                if (pl.contains("Giỏi")) countGioi++;
                else if (pl.contains("Khá") && !pl.contains("TB")) countKha++;
                else if (pl.contains("TB khá")) countTbKha++;
                else if (pl.contains("Trung bình")) countTb++;

                Cell d13 = r.createCell(13);
                d13.setCellValue(st.getPob() != null ? st.getPob() : "");
                d13.setCellStyle(styles.dataLeftStyle);
            }
        }

        // Statistics summary (IN ĐẬM)
        int totalCadets = numRows;
        int statRowIdx = curRow + 1;
        Row statRow = sheet.createRow(statRowIdx);
        statRow.setHeightInPoints(24);
        Cell statCell = statRow.createCell(0);
        statCell.setCellValue(String.format("Tổng số dự thi: %d đ/c. Trong đó: Giỏi: %d đ/c (%.1f%%); Khá: %d đ/c (%.1f%%); TB khá: %d đ/c (%.1f%%); Trung bình: %d đ/c (%.1f%%)",
                totalCadets,
                countGioi, totalCadets > 0 ? (countGioi * 100.0 / totalCadets) : 0,
                countKha, totalCadets > 0 ? (countKha * 100.0 / totalCadets) : 0,
                countTbKha, totalCadets > 0 ? (countTbKha * 100.0 / totalCadets) : 0,
                countTb, totalCadets > 0 ? (countTb * 100.0 / totalCadets) : 0));
        statCell.setCellStyle(styles.subTitleStyle);
        sheet.addMergedRegion(new CellRangeAddress(statRowIdx, statRowIdx, 0, totalCols - 1));

        // Signatures (IN ĐẬM)
        int signRowIdx = statRowIdx + 2;
        Row sRow1 = sheet.createRow(signRowIdx);
        Row sRow2 = sheet.createRow(signRowIdx + 1);
        sRow1.setHeightInPoints(24);
        sRow2.setHeightInPoints(20);

        Cell s1 = sRow1.createCell(1);
        s1.setCellValue("NGƯỜI TỔNG HỢP");
        s1.setCellStyle(styles.agencyStyle);
        Cell s1Sub = sRow2.createCell(1);
        s1Sub.setCellValue("(Ký và ghi rõ họ tên)");
        s1Sub.setCellStyle(styles.italicCenterStyle);

        Cell s2 = sRow1.createCell(6);
        s2.setCellValue("TRƯỞNG PHÒNG ĐÀO TẠO");
        s2.setCellStyle(styles.agencyStyle);
        Cell s2Sub = sRow2.createCell(6);
        s2Sub.setCellValue("(Ký và ghi rõ họ tên)");
        s2Sub.setCellStyle(styles.italicCenterStyle);

        Cell s3 = sRow1.createCell(11);
        s3.setCellValue("HIỆU TRƯỞNG / CHỈ HUY TRƯỞNG");
        s3.setCellStyle(styles.agencyStyle);
        Cell s3Sub = sRow2.createCell(11);
        s3Sub.setCellValue("(Ký và ghi rõ họ tên)");
        s3Sub.setCellStyle(styles.italicCenterStyle);

        // Column widths
        sheet.setColumnWidth(0, 5 * 256);  // TT
        sheet.setColumnWidth(1, 9 * 256);  // Số TT
        sheet.setColumnWidth(2, 8 * 256);  // Năm
        sheet.setColumnWidth(3, 24 * 256); // Họ và tên
        sheet.setColumnWidth(4, 14 * 256); // Ngày sinh
        sheet.setColumnWidth(5, 11 * 256); // CTĐ, CTCT
        sheet.setColumnWidth(6, 11 * 256); // Kỹ, C.thuật
        sheet.setColumnWidth(7, 11 * 256); // Chuyên ngành
        sheet.setColumnWidth(8, 11 * 256); // TB thi
        sheet.setColumnWidth(9, 13 * 256); // Học lực
        sheet.setColumnWidth(10, 13 * 256);// TB khóa học
        sheet.setColumnWidth(11, 12 * 256);// Rèn luyện
        sheet.setColumnWidth(12, 13 * 256);// Phân loại TN
        sheet.setColumnWidth(13, 28 * 256);// Quê quán
    }

    public byte[] exportKetQuaTotNghiepExcel(Integer classId, Integer semester) throws IOException {
        MatrixResponseDTO matrix = gradeMatrixService.getClassMatrix(classId, semester);
        ClassEntity clazz = classRepository.findById(classId).orElse(null);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            TotNghiepStyles styles = createTotNghiepStyles(workbook);
            Set<String> existingNames = new HashSet<>();
            buildTotNghiepSheet(workbook, matrix, clazz, styles, existingNames);
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportAllClassesTotNghiepExcel(Integer semester) throws IOException {
        List<ClassEntity> classes = classRepository.findAll();
        classes.sort((a, b) -> (a.getCode() != null ? a.getCode() : "").compareToIgnoreCase(b.getCode() != null ? b.getCode() : ""));

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            TotNghiepStyles styles = createTotNghiepStyles(workbook);
            Set<String> existingNames = new HashSet<>();

            if (classes.isEmpty()) {
                workbook.createSheet("DanhSachLop");
            } else {
                for (ClassEntity c : classes) {
                    MatrixResponseDTO matrix = gradeMatrixService.getClassMatrix(c.getId(), semester);
                    buildTotNghiepSheet(workbook, matrix, c, styles, existingNames);
                }
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private String formatConductGrade(String conduct) {
        if (conduct == null || conduct.trim().isEmpty()) return "Khá";
        String c = conduct.trim().toUpperCase();
        if (c.equals("XUAT_SAC") || c.equals("XUẤT SẮC")) return "Xuất sắc";
        if (c.equals("TOT") || c.equals("TỐT")) return "Tốt";
        if (c.equals("KHA") || c.equals("KHÁ")) return "Khá";
        if (c.equals("TRUNG_BINH") || c.equals("TRUNG BÌNH")) return "Trung bình";
        if (c.equals("YEU") || c.equals("KEM") || c.equals("YẾU") || c.equals("KÉM")) return "Yếu";
        return conduct;
    }

    private String formatClassification(String cls) {
        if (cls == null || cls.trim().isEmpty() || cls.equals("CHUA_XET")) return "Chưa xét";
        String c = cls.trim().toUpperCase();
        if (c.equals("XUAT_SAC") || c.equals("XUẤT SẮC")) return "Xuất sắc";
        if (c.equals("GIOI") || c.equals("GIOL") || c.equals("GIỎI")) return "Giỏi";
        if (c.equals("KHA") || c.equals("KHÁ")) return "Khá";
        if (c.equals("TB_KHA") || c.equals("TRUNG_BINH_KHA") || c.equals("TB KHÁ")) return "TB khá";
        if (c.equals("TRUNG_BINH") || c.equals("TRUNG BÌNH")) return "Trung bình";
        if (c.equals("KHONG_DAT") || c.equals("KHÔNG ĐẠT")) return "Không đạt";
        return cls;
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
        if ("KHAU_DOI_TRUONG".equalsIgnoreCase(targetGroup) || "KDT".equalsIgnoreCase(targetGroup)) tgName = "Khẩu đội trưởng (KĐT)";
        else if ("TIEU_DOI_TRUONG".equalsIgnoreCase(targetGroup) || "TDT".equalsIgnoreCase(targetGroup)) tgName = "Tiểu đội trưởng (TĐT)";
        else if ("NVKT".equalsIgnoreCase(targetGroup)) tgName = "Nhân viên Kỹ thuật (NVKT)";
        else if ("HSQ".equalsIgnoreCase(targetGroup)) tgName = "Hạ sĩ quan Chỉ huy (HSQ)";
        else if (targetGroup != null && !targetGroup.isBlank()) tgName = targetGroup;

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
        return importCurriculumFromExcel(file, null);
    }

    public Map<String, Object> importCurriculumFromExcel(MultipartFile file, String requestedCourseCode) throws IOException {
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

            Course course = null;
            if (requestedCourseCode != null && !requestedCourseCode.isBlank()) {
                course = courseRepository.findByCode(requestedCourseCode).orElse(null);
            }
            if (course == null) {
                if (subTitle.contains("2025")) {
                    course = courseRepository.findByCode("SQDB2025").orElse(null);
                } else if (subTitle.contains("2024")) {
                    course = courseRepository.findByCode("SQDB2024").orElse(null);
                }
            }
            if (course == null) {
                course = courseRepository.findByCode("SQDB2026").orElseGet(() ->
                        courseRepository.findAll().stream().findFirst().orElse(null));
            }

            final Course finalCourse = course;
            Curriculum curriculum = curriculumRepository.findByMajorIdAndCourseId(major.getId(), finalCourse.getId())
                    .orElseGet(() -> curriculumRepository.save(Curriculum.builder()
                            .major(major)
                            .course(finalCourse)
                            .name("Lộ trình Đào tạo & Thi TN " + major.getName() + " (" + finalCourse.getName() + ")")
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
