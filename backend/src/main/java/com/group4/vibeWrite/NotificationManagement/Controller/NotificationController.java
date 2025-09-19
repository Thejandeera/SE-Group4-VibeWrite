package com.group4.vibeWrite.NotificationManagement.Controller;

import com.group4.vibeWrite.NotificationManagement.Entity.Notification;
import com.group4.vibeWrite.NotificationManagement.Dto.*;
import com.group4.vibeWrite.NotificationManagement.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
@Validated
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Create a new permanent notification
     */
    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @Valid @RequestBody CreateNotificationRequest request) {

        log.info("Creating notification for user: {}", request.getUserId());

        try {
            NotificationResponse notification = notificationService.createNotification(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Notification created successfully", notification));
        } catch (Exception e) {
            log.error("Error creating notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create notification"));
        }
    }

    /**
     * Get all notifications for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
            @PathVariable String userId) {

        log.info("Fetching notifications for user: {}", userId);

        try {
            List<NotificationResponse> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok(
                    ApiResponse.success("Notifications fetched successfully", notifications));
        } catch (Exception e) {
            log.error("Error fetching notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch notifications"));
        }
    }

    /**
     * Get notifications by status for a user
     */
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotificationsByStatus(
            @PathVariable String userId,
            @PathVariable Notification.NotificationStatus status) {

        log.info("Fetching {} notifications for user: {}", status, userId);

        try {
            List<NotificationResponse> notifications = notificationService.getUserNotificationsByStatus(userId, status);
            return ResponseEntity.ok(
                    ApiResponse.success("Notifications fetched successfully", notifications));
        } catch (Exception e) {
            log.error("Error fetching notifications by status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch notifications"));
        }
    }

    /**
     * Get unread notification count for a user
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadNotificationCount(@PathVariable String userId) {
        log.info("Fetching unread notification count for user: {}", userId);

        try {
            long count = notificationService.getUnreadNotificationCount(userId);
            return ResponseEntity.ok(
                    ApiResponse.success("Unread count fetched successfully", count));
        } catch (Exception e) {
            log.error("Error fetching unread count: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch unread count"));
        }
    }

    /**
     * Get specific notification by ID
     */
    @GetMapping("/{notificationId}/user/{userId}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotification(
            @PathVariable String notificationId,
            @PathVariable String userId) {

        log.info("Fetching notification {} for user: {}", notificationId, userId);

        try {
            Optional<NotificationResponse> notification = notificationService.getNotification(notificationId, userId);

            if (notification.isPresent()) {
                return ResponseEntity.ok(
                        ApiResponse.success("Notification fetched successfully", notification.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Notification not found"));
            }
        } catch (Exception e) {
            log.error("Error fetching notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch notification"));
        }
    }

    /**
     * Update notification status by ID
     */
    @PutMapping("/{notificationId}/user/{userId}/status")
    public ResponseEntity<ApiResponse<NotificationResponse>> updateNotificationStatus(
            @PathVariable String notificationId,
            @PathVariable String userId,
            @Valid @RequestBody UpdateNotificationStatusRequest request) {

        log.info("Updating notification {} status for user: {}", notificationId, userId);

        try {
            Optional<NotificationResponse> updated = notificationService.updateNotificationStatus(
                    notificationId, userId, request.getStatus());

            if (updated.isPresent()) {
                return ResponseEntity.ok(
                        ApiResponse.success("Notification status updated successfully", updated.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Notification not found"));
            }
        } catch (Exception e) {
            log.error("Error updating notification status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update notification status"));
        }
    }

    /**
     * Update all notifications status for a user
     */
    @PutMapping("/user/{userId}/status")
    public ResponseEntity<ApiResponse<Integer>> updateAllNotificationStatus(
            @PathVariable String userId,
            @Valid @RequestBody BulkUpdateStatusRequest request) {

        log.info("Updating all notifications status for user: {}", userId);

        try {
            int updatedCount = notificationService.updateAllNotificationStatus(userId, request.getStatus());
            return ResponseEntity.ok(
                    ApiResponse.success("All notifications status updated successfully", updatedCount));
        } catch (Exception e) {
            log.error("Error updating all notifications status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update notifications status"));
        }
    }

    /**
     * Delete notification by ID
     */
    @DeleteMapping("/{notificationId}/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable String notificationId,
            @PathVariable String userId) {

        log.info("Deleting notification {} for user: {}", notificationId, userId);

        try {
            boolean deleted = notificationService.deleteNotification(notificationId, userId);

            if (deleted) {
                return ResponseEntity.ok(
                        ApiResponse.success("Notification deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Notification not found"));
            }
        } catch (Exception e) {
            log.error("Error deleting notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete notification"));
        }
    }

    /**
     * Delete all notifications for a user
     */
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(@PathVariable String userId) {
        log.info("Deleting all notifications for user: {}", userId);

        try {
            notificationService.deleteAllNotifications(userId);
            return ResponseEntity.ok(
                    ApiResponse.success("All notifications deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting all notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete all notifications"));
        }
    }
}