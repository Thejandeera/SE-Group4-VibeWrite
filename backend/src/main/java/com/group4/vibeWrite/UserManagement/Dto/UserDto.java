package com.group4.vibeWrite.UserManagement.Dto;



import com.fasterxml.jackson.annotation.JsonProperty;
import com.group4.vibeWrite.UserManagement.Entity.User.UserRole;
import com.group4.vibeWrite.UserManagement.Entity.User.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class UserDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password should be at least 6 characters")
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateUserRequest {
        private String username;

        @JsonProperty("profile_picture")
        private String profilePictureBase64;

        private UserRole role;

        private UserStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private String id;

        @JsonProperty("profile_picture_url")
        private String profilePictureUrl;

        private String username;

        private String email;

        private UserRole role;

        private UserStatus status;

        @JsonProperty("created_at")
        private LocalDateTime createdAt;

        @JsonProperty("updated_at")
        private LocalDateTime updatedAt;

        @JsonProperty("last_login")
        private LocalDateTime lastLogin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        @JsonProperty("access_token")
        private String accessToken;

        @JsonProperty("token_type")
        @Builder.Default
        private String tokenType = "Bearer";
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        @JsonProperty("current_password")
        @NotBlank(message = "Current password is required")
        private String currentPassword;

        @JsonProperty("new_password")
        @NotBlank(message = "New password is required")
        @Size(min = 6, message = "New password should be at least 6 characters")
        private String newPassword;
    }
}
