package com.group4.vibeWrite.UserManagement.Entity;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Field("profile_picture_url")
    private String profilePictureUrl;


    private String username;

    @Indexed(unique = true)
    private String email;

    @Field("password_hash")
    private String passwordHash;

    @Builder.Default
    private UserRole role = UserRole.VIEWER;

    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Field("last_login")
    private LocalDateTime lastLogin;

    public enum UserRole {
        CREATOR, ADMIN, VIEWER
    }

    public enum UserStatus {
        ACTIVE, SUSPENDED, DELETED
    }
}