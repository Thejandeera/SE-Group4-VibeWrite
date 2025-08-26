package com.group4.vibeWrite.UserManagement.Service;


import com.group4.vibeWrite.UserManagement.Dto.UserDto;
import com.group4.vibeWrite.UserManagement.Entity.User;
import com.group4.vibeWrite.UserManagement.Repository.UserRepository;
import com.group4.vibeWrite.UserManagement.Util.CloudinaryService;
import com.group4.vibeWrite.UserManagement.Util.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CloudinaryService cloudinaryService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndStatus(email, User.UserStatus.ACTIVE)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities("ROLE_" + user.getRole().name())
                .build();
    }

    public UserDto.AuthResponse register(UserDto.RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.UserRole.VIEWER)
                .status(User.UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("Successfully registered user: {}", savedUser.getEmail());

        UserDetails userDetails = loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails);

        return UserDto.AuthResponse.builder()
                .accessToken(token)
                .build();
    }

    public UserDto.AuthResponse login(UserDto.LoginRequest request) {
        log.info("Attempting to login user with email: {}", request.getEmail());

        User user = userRepository.findByEmailAndStatus(request.getEmail(), User.UserStatus.ACTIVE)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails = loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        log.info("Successfully logged in user: {}", user.getEmail());

        return UserDto.AuthResponse.builder()
                .accessToken(token)
                .build();
    }

    public UserDto.UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmailAndStatus(email, User.UserStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    public UserDto.UserResponse updateUser(String email, UserDto.UpdateUserRequest request) {
        User user = userRepository.findByEmailAndStatus(email, User.UserStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean updated = false;

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            if (userRepository.existsByUsername(request.getUsername()) &&
                    !request.getUsername().equals(user.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(request.getUsername().trim());
            updated = true;
        }

        if (request.getProfilePictureBase64() != null && !request.getProfilePictureBase64().trim().isEmpty()) {
            // Delete old profile picture if exists
            if (user.getProfilePictureUrl() != null) {
                cloudinaryService.deleteImage(user.getProfilePictureUrl());
            }

            // Upload new profile picture
            String imageUrl = cloudinaryService.uploadBase64Image(
                    request.getProfilePictureBase64(),
                    "profile_pictures"
            );
            user.setProfilePictureUrl(imageUrl);
            updated = true;
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
            updated = true;
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
            updated = true;
        }

        if (updated) {
            user.setUpdatedAt(LocalDateTime.now());
            user = userRepository.save(user);
            log.info("Successfully updated user: {}", user.getEmail());
        }

        return mapToUserResponse(user);
    }

    public void changePassword(String email, UserDto.ChangePasswordRequest request) {
        User user = userRepository.findByEmailAndStatus(email, User.UserStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Successfully changed password for user: {}", user.getEmail());
    }

    public void deleteUser(String email) {
        User user = userRepository.findByEmailAndStatus(email, User.UserStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(User.UserStatus.DELETED);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Delete profile picture if exists
        if (user.getProfilePictureUrl() != null) {
            cloudinaryService.deleteImage(user.getProfilePictureUrl());
        }

        log.info("Successfully deleted user: {}", user.getEmail());
    }

    public List<UserDto.UserResponse> getAllUsers() {
        List<User> users = userRepository.findByStatus(User.UserStatus.ACTIVE);
        return users.stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    public UserDto.UserResponse getUserById(String id) {
        User user = userRepository.findByIdAndStatus(id, User.UserStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    private UserDto.UserResponse mapToUserResponse(User user) {
        return UserDto.UserResponse.builder()
                .id(user.getId())
                .profilePictureUrl(user.getProfilePictureUrl())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
