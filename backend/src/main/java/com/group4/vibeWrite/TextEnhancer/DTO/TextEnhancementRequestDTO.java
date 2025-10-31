package com.group4.vibeWrite.TextEnhancer.DTO;



import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextEnhancementRequestDTO {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Normal text is required")
    private String normalText;

    @NotBlank(message = "Enhanced text is required")
    private String enhancedText;

    @NotBlank(message = "Option is required")
    private String option;
}
