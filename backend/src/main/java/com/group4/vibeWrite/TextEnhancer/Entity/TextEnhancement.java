package com.group4.vibeWrite.TextEnhancer.Entity;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "text_enhancements")
public class TextEnhancement {

    @Id
    private String id;

    private String userId;

    private String normalText;

    private String enhancedText;

    private String option; // formal, casual, professional, creative, etc.

    private LocalDateTime timestamp;
}
