package com.group4.vibeWrite.NotificationManagement.Dto;

import com.group4.vibeWrite.NotificationManagement.Entity.Notification;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNotificationStatusRequest {
    @NotNull(message = "Status is required")
    private Notification.NotificationStatus status;
}