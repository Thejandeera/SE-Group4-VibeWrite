package com.group4.vibeWrite.NotificationManagement.Repository;

import com.group4.vibeWrite.NotificationManagement.Entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Find all notifications by user ID
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // Find notification by ID and user ID (for security)
    Optional<Notification> findByIdAndUserId(String id, String userId);

    // Find notifications by user ID and status
    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, Notification.NotificationStatus status);

    // Count unread notifications for a user
    long countByUserIdAndStatus(String userId, Notification.NotificationStatus status);

    // Delete all notifications for a user
    void deleteByUserId(String userId);

    // Update all notifications status for a user
    @Query("{ 'userId': ?0 }")
    List<Notification> findByUserId(String userId);
}