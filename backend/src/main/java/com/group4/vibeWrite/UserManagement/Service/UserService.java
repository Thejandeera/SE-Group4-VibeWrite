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
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

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

    // Updated method to handle MultipartFile
    public UserDto.UserResponse updateUser(String email, UserDto.UpdateUserRequest request, MultipartFile profilePicture) {
        User user = userRepository.findByEmailAndStatus(email, User.UserStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean updated = false;

        // Update username
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            if (userRepository.existsByUsername(request.getUsername()) &&
                    !request.getUsername().equals(user.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(request.getUsername().trim());
            updated = true;
        }

        // Handle profile picture upload
        if (profilePicture != null && !profilePicture.isEmpty()) {
            // Validate file type
            String contentType = profilePicture.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("File must be an image");
            }

            // Validate file size (e.g., max 5MB)
            if (profilePicture.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("File size must be less than 5MB");
            }

            try {
                // Delete old profile picture if exists
                if (user.getProfilePictureUrl() != null) {
                    cloudinaryService.deleteImage(user.getProfilePictureUrl());
                }

                // Upload new profile picture
                String imageUrl = cloudinaryService.uploadMultipartFile(profilePicture, "profile_pictures");
                user.setProfilePictureUrl(imageUrl);
                updated = true;
            } catch (Exception e) {
                log.error("Failed to upload profile picture", e);
                throw new RuntimeException("Failed to upload profile picture: " + e.getMessage());
            }
        }

        // Update role
        if (request.getRole() != null) {
            user.setRole(User.UserRole.valueOf(request.getRole().name()));
            updated = true;
        }

        // Update status
        if (request.getStatus() != null) {
            user.setStatus(User.UserStatus.valueOf(request.getStatus().name()));
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
                .role(UserDto.UserRole.valueOf(user.getRole().name()))
                .status(UserDto.UserStatus.valueOf(user.getStatus().name()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}