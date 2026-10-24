package com.intranet.grade.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(tokenProvider, userDetailsService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/v1/auth/**", "/api/v1/auth/**", "/auth/**", "/error", "/v1/system/**", "/api/v1/system/**", "/actuator/**", "/h2-console/**").permitAll()
                .requestMatchers("/v1/admissions/export-template", "/api/v1/admissions/export-template").permitAll()
                .requestMatchers(HttpMethod.GET,
                        "/v1/classes/*/export-excel", "/api/v1/classes/*/export-excel",
                        "/v1/classes/*/export-hoc-phan", "/api/v1/classes/*/export-hoc-phan",
                        "/v1/classes/*/export-tot-nghiep", "/api/v1/classes/*/export-tot-nghiep",
                        "/v1/classes/export-all-classes-hoc-phan", "/api/v1/classes/export-all-classes-hoc-phan",
                        "/v1/classes/export-all-classes-tot-nghiep", "/api/v1/classes/export-all-classes-tot-nghiep",
                        "/v1/classes/export-tong-hop-xet-dieu-kien", "/api/v1/classes/export-tong-hop-xet-dieu-kien",
                        "/v1/students/export-excel", "/api/v1/students/export-excel"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/v1/curriculums/**", "/api/v1/curriculums/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/v1/curriculums/import-excel", "/api/v1/curriculums/import-excel").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers(HttpMethod.GET, "/v1/majors/**", "/api/v1/majors/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/v1/majors/**", "/api/v1/majors/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers(HttpMethod.PUT, "/v1/majors/**", "/api/v1/majors/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers(HttpMethod.DELETE, "/v1/majors/**", "/api/v1/majors/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers(HttpMethod.DELETE, "/v1/classes/**", "/api/v1/classes/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers("/v1/classes/*/matrix/bulk-update", "/api/v1/classes/*/matrix/bulk-update").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_TRUONGKHOA", "ROLE_BOMON", "ROLE_GIANGVIEN")
                .requestMatchers("/v1/classes/*/import-excel", "/api/v1/classes/*/import-excel").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers("/v1/audit-logs/**", "/api/v1/audit-logs/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_TRUONGKHOA", "ROLE_BOMON")
                .requestMatchers("/v1/classes/lock-all", "/api/v1/classes/lock-all", "/v1/classes/unlock-all", "/api/v1/classes/unlock-all", "/v1/classes/schedule-lock-all", "/api/v1/classes/schedule-lock-all", "/v1/classes/cancel-schedule-lock-all", "/api/v1/classes/cancel-schedule-lock-all").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers("/v1/admissions/**", "/api/v1/admissions/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers(HttpMethod.POST, "/v1/students/**", "/api/v1/students/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_DONVI")
                .requestMatchers(HttpMethod.PUT, "/v1/students/**", "/api/v1/students/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_DONVI")
                .requestMatchers(HttpMethod.DELETE, "/v1/students/**", "/api/v1/students/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers("/v1/departments/users/**", "/api/v1/departments/users/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT")
                .requestMatchers("/v1/**", "/api/**").authenticated()
                .anyRequest().permitAll()
            );

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
