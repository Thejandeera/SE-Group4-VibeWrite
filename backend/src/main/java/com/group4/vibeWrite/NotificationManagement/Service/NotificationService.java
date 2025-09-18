package com.group4.vibeWrite.NotificationManagement.Service;

import com.group4.vibeWrite.NotificationManagement.Entity.Notification;
import com.group4.vibeWrite.NotificationManagement.Dto.CreateNotificationRequest;
import com.group4.vibeWrite.NotificationManagement.Dto.NotificationResponse;
import com.group4.vibeWrite.NotificationManagement.Repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Create a new permanent notification
     */
    @Transactional
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        log.info("Creating notification for user: {}", request.getUserId());

        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .description(request.getDescription())
                .status(Notification.NotificationStatus.unread)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created with ID: {}", saved.getId());

        return NotificationResponse.fromEntity(saved);
    }

    /**
     * Get all notifications for a user
     */
    public List<NotificationResponse> getUserNotifications(String userId) {
        log.info("Fetching notifications for user: {}", userId);

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get notifications by status for a user
     */
    public List<NotificationResponse> getUserNotificationsByStatus(String userId, Notification.NotificationStatus status) {
        log.info("Fetching {} notifications for user: {}", status, userId);

        List<Notification> notifications = notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        return notifications.stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update notification status by ID
     */
    @Transactional
    public Optional<NotificationResponse> updateNotificationStatus(String notificationId, String userId, Notification.NotificationStatus status) {
        log.info("Updating notification {} status to {} for user: {}", notificationId, status, userId);

        Optional<Notification> notificationOpt = notificationRepository.findByIdAndUserId(notificationId, userId);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setStatus(status);
            notification.setUpdatedAt(LocalDateTime.now());

            Notification updated = notificationRepository.save(notification);
            log.info("Notification {} status updated successfully", notificationId);

            return Optional.of(NotificationResponse.fromEntity(updated));
        }

        log.warn("Notification {} not found for user: {}", notificationId, userId);
        return Optional.empty();
    }

    /**
     * Update all notifications status for a user
     */
    @Transactional
    public int updateAllNotificationStatus(String userId, Notification.NotificationStatus status) {
        log.info("Updating all notifications to {} for user: {}", status, userId);

        List<Notification> notifications = notificationRepository.findByUserId(userId);

        for (Notification notification : notifications) {
            notification.setStatus(status);
            notification.setUpdatedAt(LocalDateTime.now());
        }

        notificationRepository.saveAll(notifications);
        log.info("Updated {} notifications for user: {}", notifications.size(), userId);

        return notifications.size();
    }

    /**
     * Delete notification by ID
     */
    @Transactional
    public boolean deleteNotification(String notificationId, String userId) {
        log.info("Deleting notification {} for user: {}", notificationId, userId);

        Optional<Notification> notificationOpt = notificationRepository.findByIdAndUserId(notificationId, userId);

        if (notificationOpt.isPresent()) {
            notificationRepository.delete(notificationOpt.get());
            log.info("Notification {} deleted successfully", notificationId);
            return true;
        }

        log.warn("Notification {} not found for user: {}", notificationId, userId);
        return false;
    }

    /**
     * Delete all notifications for a user
     */
    @Transactional
    public void deleteAllNotifications(String userId) {
        log.info("Deleting all notifications for user: {}", userId);

        notificationRepository.deleteByUserId(userId);
        log.info("All notifications deleted for user: {}", userId);
    }

    /**
     * Get unread notifications count for a user
     */
    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByUserIdAndStatus(userId, Notification.NotificationStatus.unread);
    }

    /**
     * Get notification by ID and user ID
     */
    public Optional<NotificationResponse> getNotification(String notificationId, String userId) {
        log.info("Fetching notification {} for user: {}", notificationId, userId);

        Optional<Notification> notificationOpt = notificationRepository.findByIdAndUserId(notificationId, userId);
        return notificationOpt.map(NotificationResponse::fromEntity);
    }
}