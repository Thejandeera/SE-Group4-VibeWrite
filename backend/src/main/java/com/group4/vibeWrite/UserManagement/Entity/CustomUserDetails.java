package com.group4.vibeWrite.UserManagement.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    // All fields from User entity
    private String id;
    private String profilePictureUrl;
    private String username;
    private String email;
    private String passwordHash;
    private User.UserRole role;
    private User.UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

    // Constructor to create from User entity
    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.passwordHash = user.getPasswordHash();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.lastLogin = user.getLastLogin();
    }

    // Static factory method
    public static CustomUserDetails fromUser(User user) {
        return new CustomUserDetails(user);
    }

    // UserDetails interface implementations
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email; // Using email as username for authentication
    }

    @Override
    public boolean isAccountNonExpired() {
        return status != User.UserStatus.DELETED;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != User.UserStatus.SUSPENDED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == User.UserStatus.ACTIVE;
    }

    // Additional getter methods for easy access
    public String getActualUsername() {
        return username; // The actual username field
    }
}