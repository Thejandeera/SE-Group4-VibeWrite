//package com.group4.vibeWrite.SemanticAnalysis.dto;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import lombok.Builder;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Map;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class SemanticAnalysisResponse {
//
//    private String originalText;
//    private List<String> tokens;
//    private List<String> sentences;
//    private Map<String, String> posTags;
//    private Map<String, String> lemmas;
//    private Map<String, String> namedEntities;
//    private Map<String, String> sentiment;
//
//    private SemanticMetrics metrics;
//    private int complexityScore;
//    private LocalDateTime analyzedAt;
//    private String error;
//
//    @Data
//    @NoArgsConstructor
//    @AllArgsConstructor
//    @Builder
//    public static class SemanticMetrics {
//        private int wordCount;
//        private int sentenceCount;
//        private int uniqueWordCount;
//        private int namedEntityCount;
//        private double averageWordsPerSentence;
//        private double lexicalDiversity;
//        private double readabilityScore;
//        private Map<String, Integer> posTagCounts;
//        private Map<String, Integer> sentimentDistribution;
//        private Map<String, Integer> entityTypeCounts;
//        private double semanticDensity;
//    }
//}
//
