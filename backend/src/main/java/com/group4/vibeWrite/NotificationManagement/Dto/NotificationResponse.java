package com.group4.vibeWrite.NotificationManagement.Dto;
import com.group4.vibeWrite.NotificationManagement.Entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String id;
    private String userId;
    private String name;
    private String description;
    private Notification.NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NotificationResponse fromEntity(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .name(notification.getName())
                .description(notification.getDescription())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .updatedAt(notification.getUpdatedAt())
                .build();
    }
}