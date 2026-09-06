package com.intranet.grade.controller;

import com.intranet.grade.dto.AuthRequest;
import com.intranet.grade.dto.AuthResponse;
import com.intranet.grade.security.CustomUserDetails;
import com.intranet.grade.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String jwt = tokenProvider.generateToken(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .username(userDetails.getUsername())
                    .fullName(userDetails.getFullName())
                    .role(userDetails.getRole())
                    .departmentId(userDetails.getDepartmentId())
                    .build());
        } catch (org.springframework.security.core.AuthenticationException ex) {
            return ResponseEntity.status(401).body(java.util.Map.of(
                    "success", false,
                    "message", "Sai tên đăng nhập hoặc mật khẩu: " + ex.getMessage()
            ));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(AuthResponse.builder()
                .username(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .departmentId(userDetails.getDepartmentId())
                .build());
    }
}
