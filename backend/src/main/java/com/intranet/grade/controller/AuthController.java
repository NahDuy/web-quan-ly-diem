package com.intranet.grade.controller;

import com.intranet.grade.dto.AuthRequest;
import com.intranet.grade.dto.AuthResponse;
import com.intranet.grade.dto.RegisterRequest;
import com.intranet.grade.entity.Department;
import com.intranet.grade.entity.Role;
import com.intranet.grade.entity.User;
import com.intranet.grade.repository.DepartmentRepository;
import com.intranet.grade.repository.RoleRepository;
import com.intranet.grade.repository.UserRepository;
import com.intranet.grade.security.CustomUserDetails;
import com.intranet.grade.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

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

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String usernameClean = request.getUsername().trim().toLowerCase();
            if (userRepository.existsByUsername(usernameClean)) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "success", false,
                        "message", "Tên đăng nhập đã tồn tại trong hệ thống"
                ));
            }

            String roleCode = request.getRole() != null && !request.getRole().isBlank()
                    ? request.getRole()
                    : "ROLE_GIANGVIEN";

            Role role = roleRepository.findByCode(roleCode)
                    .orElseGet(() -> roleRepository.findByCode("ROLE_GIANGVIEN")
                            .orElseThrow(() -> new RuntimeException("Vai trò không tồn tại")));

            Department department = null;
            if (request.getDepartmentId() != null) {
                department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
            }

            User user = User.builder()
                    .username(usernameClean)
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .fullName(request.getFullName().trim())
                    .email(request.getEmail() != null && !request.getEmail().isBlank() ? request.getEmail().trim() : null)
                    .role(role)
                    .department(department)
                    .isActive(true)
                    .build();

            userRepository.save(user);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
            );
            String jwt = tokenProvider.generateToken(authentication);

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .role(role.getCode())
                    .departmentId(department != null ? department.getId() : null)
                    .build());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "success", false,
                    "message", "Đăng ký thất bại: " + ex.getMessage()
            ));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(AuthResponse.builder()
                .username(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .departmentId(userDetails.getDepartmentId())
                .build());
    }
}
