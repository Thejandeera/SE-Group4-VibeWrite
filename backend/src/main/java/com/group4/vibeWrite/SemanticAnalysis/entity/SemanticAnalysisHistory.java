package com.group4.vibeWrite.SemanticAnalysis.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "semantic_analysis_history")
public class SemanticAnalysisHistory {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String originalText;
    private List<String> tokens;
    private List<String> sentences;
    private Map<String, String> posTags;
    private Map<String, String> lemmas;
    private Map<String, String> namedEntities;
    private Map<String, String> sentiment;

    private SemanticMetrics metrics;
    private int complexityScore;

    @Indexed
    private LocalDateTime analyzedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SemanticMetrics {
        private int wordCount;
        private int sentenceCount;
        private int uniqueWordCount;
        private int namedEntityCount;
        private double averageWordsPerSentence;
        private double lexicalDiversity;
        private double readabilityScore;
        private Map<String, Integer> posTagCounts;
        private Map<String, Integer> sentimentDistribution;
        private Map<String, Integer> entityTypeCounts;
        private double semanticDensity;
    }

    public SemanticAnalysisHistory(String userId, String originalText, List<String> tokens,
                                   List<String> sentences, Map<String, String> posTags,
                                   Map<String, String> lemmas, Map<String, String> namedEntities,
                                   Map<String, String> sentiment, SemanticMetrics metrics,
                                   int complexityScore) {
        this.userId = userId;
        this.originalText = originalText;
        this.tokens = tokens;
        this.sentences = sentences;
        this.posTags = posTags;
        this.lemmas = lemmas;
        this.namedEntities = namedEntities;
        this.sentiment = sentiment;
        this.metrics = metrics;
        this.complexityScore = complexityScore;
        this.analyzedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
