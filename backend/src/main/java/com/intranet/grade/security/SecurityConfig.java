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
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/v1/auth/**", "/api/v1/auth/**", "/auth/**", "/error").permitAll()
                .requestMatchers("/v1/students/**", "/api/v1/students/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/v1/classes/**", "/api/v1/classes/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/v1/dashboard/**", "/api/v1/dashboard/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/v1/curriculums/**", "/api/v1/curriculums/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/v1/classes/**", "/api/v1/classes/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_ADMIN")
                .requestMatchers("/v1/classes/*/matrix/bulk-update", "/api/v1/classes/*/matrix/bulk-update").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_ADMIN", "ROLE_TRUONGKHOA", "ROLE_BOMON", "ROLE_GIANGVIEN")
                .requestMatchers("/v1/classes/*/import-excel", "/api/v1/classes/*/import-excel").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_ADMIN")
                .requestMatchers("/v1/audit-logs/**", "/api/v1/audit-logs/**").hasAnyAuthority("ROLE_BGH", "ROLE_PDT", "ROLE_ADMIN", "ROLE_TRUONGKHOA", "ROLE_BOMON")
                .anyRequest().permitAll()
            );

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
