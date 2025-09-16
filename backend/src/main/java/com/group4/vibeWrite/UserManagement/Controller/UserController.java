package com.group4.vibeWrite.UserManagement.Controller;

import com.group4.vibeWrite.UserManagement.Dto.UserDto;
import com.group4.vibeWrite.UserManagement.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "${frontend.url}"})
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto.AuthResponse> register(@Valid @RequestBody UserDto.RegisterRequest request) {
        try {
            UserDto.AuthResponse response = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Registration failed for email: {}", request.getEmail(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto.AuthResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        try {
            UserDto.AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto.UserResponse> getUserProfile(Authentication authentication) {
        try {
            String email = getUserEmail(authentication);
            UserDto.UserResponse response = userService.getUserProfile(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get user profile", e);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ResponseEntity<UserDto.UserResponse> updateUser(
            Authentication authentication,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            String email = getUserEmail(authentication);

            UserDto.UpdateUserRequest request = UserDto.UpdateUserRequest.builder()
                    .username(username)
                    .role(role != null ? UserDto.UserRole.valueOf(role.toUpperCase()) : null)
                    .status(status != null ? UserDto.UserStatus.valueOf(status.toUpperCase()) : null)
                    .build();

            UserDto.UserResponse response = userService.updateUser(email, request, profilePicture);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Failed to update user", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Alternative endpoint for JSON-only updates (without file upload)
    @PutMapping(value = "/profile/info", consumes = "application/json")
    public ResponseEntity<UserDto.UserResponse> updateUserInfo(
            Authentication authentication,
            @Valid @RequestBody UserDto.UpdateUserInfoRequest request) {
        try {
            String email = getUserEmail(authentication);

            UserDto.UpdateUserRequest updateRequest = UserDto.UpdateUserRequest.builder()
                    .username(request.getUsername())
                    .role(request.getRole())
                    .status(request.getStatus())
                    .build();

            UserDto.UserResponse response = userService.updateUser(email, updateRequest, null);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Failed to update user info", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody UserDto.ChangePasswordRequest request) {
        try {
            String email = getUserEmail(authentication);
            userService.changePassword(email, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to change password", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteUser(Authentication authentication) {
        try {
            String email = getUserEmail(authentication);
            userService.deleteUser(email);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete user", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDto.UserResponse>> getAllUsers() {
        try {
            List<UserDto.UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Failed to get all users", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto.UserResponse> getUserById(@PathVariable String id) {
        try {
            UserDto.UserResponse response = userService.getUserById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get user by id: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    private String getUserEmail(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        throw new RuntimeException("User not authenticated");
    }
}