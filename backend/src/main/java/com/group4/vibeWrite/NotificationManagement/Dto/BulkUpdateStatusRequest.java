package com.group4.vibeWrite.NotificationManagement.Dto;

import com.group4.vibeWrite.NotificationManagement.Entity.Notification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUpdateStatusRequest {
    @NotNull(message = "Status is required")
    private Notification.NotificationStatus status;

    @NotBlank(message = "User ID is required")
    private String userId;
}
