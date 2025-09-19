package com.group4.vibeWrite.GrammerCheckerManagement.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarCheckResponse {
    private String originalText;
    private String correctedText;
    private int grammarScore; // Score out of 100
    private int totalErrors;
    private List<GrammarError> errors;
    private GrammarMetrics metrics;
    private LocalDateTime checkedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GrammarMetrics {
        private int wordCount;
        private int sentenceCount;
        private int spellingErrors;
        private int grammarErrors;
        private int punctuationErrors;
        private int styleIssues;
        private double readabilityScore;
    }
}
