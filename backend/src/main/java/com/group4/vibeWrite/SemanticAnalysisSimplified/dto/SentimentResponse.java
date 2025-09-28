package com.group4.vibeWrite.SemanticAnalysisSimplified.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Data Transfer Object for the sentiment analysis response.
 * @Data generates all necessary public getters, setters, equals, hashCode, and toString methods,
 * resolving the HttpMediaTypeNotAcceptableException.
 * @Builder enables the fluent builder pattern used in the controller.
 * @NoArgsConstructor and @AllArgsConstructor are good practice for DTOs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResponse {

    private String originalText;
    private Map<String, String> sentenceSentiments;
    private String overallSentiment;
    private int totalSentences;
    private LocalDateTime analyzedAt;
    private String error;
}