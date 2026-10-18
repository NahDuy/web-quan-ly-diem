package com.intranet.grade.controller;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.util.*;

@RestController
@RequestMapping("/v1/system")
@RequiredArgsConstructor
public class SystemStatusController {

    private final DataSource dataSource;
    private final MeterRegistry meterRegistry;
    private final JdbcTemplate jdbcTemplate;

    private static final Set<String> ALLOWED_TABLES = Set.of(
            "STUDENTS", "GRADES", "CLASSES", "SUBJECTS", "CURRICULUMS",
            "CURRICULUM_SUBJECTS", "MAJORS", "USERS", "DEPARTMENTS",
            "GRADE_AUDIT_LOGS", "GRADE_LOCKS", "COURSES"
    );

    private static final Map<String, String> TABLE_LABELS = Map.ofEntries(
            Map.entry("STUDENTS", "Học viên"),
            Map.entry("GRADES", "Bảng điểm chi tiết"),
            Map.entry("CLASSES", "Lớp học viên"),
            Map.entry("SUBJECTS", "Môn học đào tạo"),
            Map.entry("CURRICULUMS", "Lộ trình đào tạo"),
            Map.entry("CURRICULUM_SUBJECTS", "Môn học theo lộ trình"),
            Map.entry("MAJORS", "Chuyên ngành quân sự"),
            Map.entry("USERS", "Tài khoản cán bộ / GV"),
            Map.entry("DEPARTMENTS", "Khoa & Đơn vị"),
            Map.entry("GRADE_AUDIT_LOGS", "Nhật ký can thiệp điểm"),
            Map.entry("GRADE_LOCKS", "Khóa / Mở khóa điểm"),
            Map.entry("COURSES", "Khóa đào tạo")
    );

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "ONLINE");

        // Server uptime in seconds
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        status.put("uptimeSeconds", uptimeMs / 1000);

        // RAM memory usage in MB
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);
        long usedMemory = totalMemory - freeMemory;
        status.put("memoryUsedMb", usedMemory);
        status.put("memoryTotalMb", totalMemory);

        // Total HTTP Requests handled
        long requestCount = 0;
        try {
            var search = meterRegistry.find("http.server.requests");
            Timer timer = search.timer();
            if (timer != null) {
                requestCount = timer.count();
            } else {
                var timers = search.timers();
                for (Timer t : timers) {
                    requestCount += t.count();
                }
            }
        } catch (Exception ignored) {}
        status.put("totalRequests", requestCount);

        // Database connectivity check
        boolean dbConnected = false;
        try (Connection conn = dataSource.getConnection()) {
            dbConnected = conn.isValid(2);
        } catch (Exception ignored) {}
        status.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");

        return ResponseEntity.ok(status);
    }

    @GetMapping("/database-tables")
    public ResponseEntity<List<Map<String, Object>>> getDatabaseTables() {
        List<Map<String, Object>> result = new ArrayList<>();

        for (String table : ALLOWED_TABLES) {
            try {
                Long count = jdbcTemplate.queryForObject("SELECT count(*) FROM " + table, Long.class);
                Map<String, Object> item = new HashMap<>();
                item.put("tableName", table);
                item.put("displayName", TABLE_LABELS.getOrDefault(table, table));
                item.put("rowCount", count != null ? count : 0L);
                result.add(item);
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/database-tables/{table}")
    public ResponseEntity<Map<String, Object>> getTableData(
            @PathVariable String table,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        String upperTable = table.toUpperCase();
        if (!ALLOWED_TABLES.contains(upperTable)) {
            return ResponseEntity.badRequest().build();
        }

        Map<String, Object> response = new HashMap<>();
        try {
            Long total = jdbcTemplate.queryForObject("SELECT count(*) FROM " + upperTable, Long.class);
            response.put("total", total != null ? total : 0);

            int offset = page * size;
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                    "SELECT * FROM " + upperTable + " LIMIT ? OFFSET ?", size, offset
            );
            response.put("rows", rows);

            List<String> columns = new ArrayList<>();
            if (!rows.isEmpty()) {
                columns.addAll(rows.get(0).keySet());
            }
            response.put("columns", columns);
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
}
