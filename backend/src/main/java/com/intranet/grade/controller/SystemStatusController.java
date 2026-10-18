package com.intranet.grade.controller;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/system")
@RequiredArgsConstructor
public class SystemStatusController {

    private final DataSource dataSource;
    private final MeterRegistry meterRegistry;

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
}
