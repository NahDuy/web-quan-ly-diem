package com.intranet.grade.security;

import com.intranet.grade.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String username;
    private final String password;
    private final String fullName;
    private final String role;
    private final Integer departmentId;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPasswordHash();
        this.fullName = user.getFullName();
        this.role = user.getRole().getCode();
        this.departmentId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getCode()));
    }

    public String getRoleCode() {
        return this.role;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
