package com.group4.vibeWrite.GrammerCheckerManagement.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "grammar_check_history")
public class GrammarCheckHistory {

    @Id
    private String id;

    @Indexed
    private String userId; // Reference to user who performed the check

    private String originalText;
    private String correctedText;
    private int grammarScore;
    private int totalErrors;
    private List<ErrorDetail> errors;
    private Metrics metrics;

    @Indexed
    private LocalDateTime checkedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetail {
        private int startPosition;
        private int endPosition;
        private String errorType;
        private String originalText;
        private String suggestedText;
        private String description;
        private String severity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metrics {
        private int wordCount;
        private int sentenceCount;
        private int spellingErrors;
        private int grammarErrors;
        private int punctuationErrors;
        private int styleIssues;
        private double readabilityScore;
    }

    // Constructor for creating new entries
    public GrammarCheckHistory(String userId, String originalText, String correctedText,
                               int grammarScore, int totalErrors, List<ErrorDetail> errors, Metrics metrics) {
        this.userId = userId;
        this.originalText = originalText;
        this.correctedText = correctedText;
        this.grammarScore = grammarScore;
        this.totalErrors = totalErrors;
        this.errors = errors;
        this.metrics = metrics;
        this.checkedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}