package com.group4.vibeWrite.TextEnhancer.DTO;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextEnhancementResponseDTO {

    private String id;
    private String userId;
    private String normalText;
    private String enhancedText;
    private String option;
    private LocalDateTime timestamp;
}
