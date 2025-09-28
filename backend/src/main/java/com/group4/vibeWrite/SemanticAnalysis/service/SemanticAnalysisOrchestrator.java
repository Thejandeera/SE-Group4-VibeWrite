//package com.group4.vibeWrite.SemanticAnalysis.service;
//
//import com.group4.vibeWrite.SemanticAnalysis.dto.SemanticAnalysisRequest;
//import com.group4.vibeWrite.SemanticAnalysis.dto.SemanticAnalysisResponse;
//import com.group4.vibeWrite.SemanticAnalysis.entity.SemanticAnalysisHistory;
//import com.group4.vibeWrite.SemanticAnalysis.repository.SemanticAnalysisRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class SemanticAnalysisOrchestrator {
//
//    // Keep your existing services
//    private final TokenizeService tokenizeService;
//    private final SentenceRecognizerService sentenceRecognizerService;
//    private final POSService posService;
//    private final LemmaService lemmaService;
//    private final NERService nerService;
//    private final SentimentAnalysisService sentimentAnalysisService;
//
//    // New repository for history management
//    private final SemanticAnalysisRepository repository;
//
//    // Getter methods for controller access
//    public TokenizeService getTokenizeService() { return tokenizeService; }
//    public SentenceRecognizerService getSentenceRecognizerService() { return sentenceRecognizerService; }
//    public POSService getPosService() { return posService; }
//    public LemmaService getLemmaService() { return lemmaService; }
//    public NERService getNerService() { return nerService; }
//    public SentimentAnalysisService getSentimentAnalysisService() { return sentimentAnalysisService; }
//
//    public SemanticAnalysisResponse performCompleteAnalysis(SemanticAnalysisRequest request, String userId) {
//        String text = request.getText();
//
//        if (text == null || text.trim().isEmpty()) {
//            return SemanticAnalysisResponse.builder()
//                    .error("Input text cannot be empty")
//                    .build();
//        }
//
//        try {
//            // Use your existing services
//            List<String> tokens = tokenizeService.tokenizeText(text);
//            List<String> sentences = sentenceRecognizerService.recognizeSentences(text);
//            Map<String, String> posTags = posService.getPOSTags(text);
//            Map<String, String> lemmas = lemmaService.lemmatizeText(text);
//            Map<String, String> namedEntities = nerService.extractNamedEntities(text);
//            Map<String, String> sentiment = sentimentAnalysisService.analyzeSentiment(text);
//
//            // New enhanced metrics calculation
//            SemanticAnalysisResponse.SemanticMetrics metrics = calculateEnhancedMetrics(
//                    text, tokens, sentences, posTags, lemmas, namedEntities, sentiment);
//
//            // New complexity scoring
//            int complexityScore = calculateComplexityScore(text, tokens, sentences, posTags,
//                    namedEntities, metrics);
//
//            SemanticAnalysisResponse response = SemanticAnalysisResponse.builder()
//                    .originalText(text)
//                    .tokens(tokens)
//                    .sentences(sentences)
//                    .posTags(posTags)
//                    .lemmas(lemmas)
//                    .namedEntities(namedEntities)
//                    .sentiment(sentiment)
//                    .metrics(metrics)
//                    .complexityScore(complexityScore)
//                    .analyzedAt(LocalDateTime.now())
//                    .build();
//
//            // Save to history if userId provided
//            if (userId != null && !userId.trim().isEmpty()) {
//                saveToHistory(response, userId);
//            }
//
//            return response;
//
//        } catch (Exception e) {
//            log.error("Error in semantic analysis: ", e);
//            return SemanticAnalysisResponse.builder()
//                    .originalText(text)
//                    .error("Analysis failed: " + e.getMessage())
//                    .build();
//        }
//    }
//
//    private SemanticAnalysisResponse.SemanticMetrics calculateEnhancedMetrics(
//            String text, List<String> tokens, List<String> sentences,
//            Map<String, String> posTags, Map<String, String> lemmas,
//            Map<String, String> namedEntities, Map<String, String> sentiment) {
//
//        int wordCount = tokens.size();
//        int sentenceCount = Math.max(1, sentences.size());
//        Set<String> uniqueWords = new HashSet<>(tokens.stream()
//                .map(String::toLowerCase).collect(Collectors.toList()));
//        int uniqueWordCount = uniqueWords.size();
//        int namedEntityCount = namedEntities.size();
//
//        double avgWordsPerSentence = (double) wordCount / sentenceCount;
//        double lexicalDiversity = wordCount > 0 ? (double) uniqueWordCount / wordCount : 0;
//
//        Map<String, Integer> posTagCounts = posTags.values().stream()
//                .collect(Collectors.groupingBy(tag -> tag,
//                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)));
//
//        Map<String, Integer> sentimentDistribution = sentiment.values().stream()
//                .collect(Collectors.groupingBy(s -> s,
//                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)));
//
//        Map<String, Integer> entityTypeCounts = namedEntities.values().stream()
//                .collect(Collectors.groupingBy(type -> type,
//                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)));
//
//        long meaningfulWords = posTags.values().stream()
//                .filter(pos -> pos.startsWith("NN") || pos.startsWith("VB") ||
//                        pos.startsWith("JJ") || pos.startsWith("RB"))
//                .count();
//        double semanticDensity = wordCount > 0 ? (double) meaningfulWords / wordCount : 0;
//
//        return SemanticAnalysisResponse.SemanticMetrics.builder()
//                .wordCount(wordCount)
//                .sentenceCount(sentenceCount)
//                .uniqueWordCount(uniqueWordCount)
//                .namedEntityCount(namedEntityCount)
//                .averageWordsPerSentence(avgWordsPerSentence)
//                .lexicalDiversity(lexicalDiversity)
//                .posTagCounts(posTagCounts)
//                .sentimentDistribution(sentimentDistribution)
//                .entityTypeCounts(entityTypeCounts)
//                .semanticDensity(semanticDensity)
//                .build();
//    }
//
//    private int estimateSyllables(String word) {
//        word = word.toLowerCase().replaceAll("[^a-z]", "");
//        if (word.length() == 0) return 0;
//        int syllables = 0;
//        boolean previousWasVowel = false;
//        for (char c : word.toCharArray()) {
//            boolean isVowel = "aeiouy".indexOf(c) != -1;
//            if (isVowel && !previousWasVowel) syllables++;
//            previousWasVowel = isVowel;
//        }
//        if (word.endsWith("e") && syllables > 1) syllables--;
//        return Math.max(1, syllables);
//    }
//
//    private int calculateComplexityScore(String text, List<String> tokens, List<String> sentences,
//                                         Map<String, String> posTags, Map<String, String> namedEntities,
//                                         SemanticAnalysisResponse.SemanticMetrics metrics) {
//        int baseScore = 50;
//        if (metrics.getLexicalDiversity() > 0.7) baseScore += 15;
//        else if (metrics.getLexicalDiversity() > 0.5) baseScore += 10;
//        else if (metrics.getLexicalDiversity() < 0.3) baseScore -= 10;
//
//        if (metrics.getAverageWordsPerSentence() > 20) baseScore += 10;
//        else if (metrics.getAverageWordsPerSentence() > 15) baseScore += 5;
//        else if (metrics.getAverageWordsPerSentence() < 8) baseScore -= 5;
//
//        double entityDensity = (double) namedEntities.size() / Math.max(1, tokens.size());
//        if (entityDensity > 0.1) baseScore += 10;
//        else if (entityDensity > 0.05) baseScore += 5;
//
//        Set<String> uniquePosTags = new HashSet<>(posTags.values());
//        if (uniquePosTags.size() > 15) baseScore += 10;
//        else if (uniquePosTags.size() > 10) baseScore += 5;
//
//        if (metrics.getSemanticDensity() > 0.6) baseScore += 10;
//        else if (metrics.getSemanticDensity() > 0.4) baseScore += 5;
//
//        if (tokens.size() > 200) baseScore += 5;
//        else if (tokens.size() < 20) baseScore -= 10;
//
//        return Math.max(0, Math.min(100, baseScore));
//    }
//
//    private void saveToHistory(SemanticAnalysisResponse response, String userId) {
//        try {
//            SemanticAnalysisHistory.SemanticMetrics historyMetrics =
//                    new SemanticAnalysisHistory.SemanticMetrics(
//                            response.getMetrics().getWordCount(),
//                            response.getMetrics().getSentenceCount(),
//                            response.getMetrics().getUniqueWordCount(),
//                            response.getMetrics().getNamedEntityCount(),
//                            response.getMetrics().getAverageWordsPerSentence(),
//                            response.getMetrics().getLexicalDiversity(),
//                            response.getMetrics().getReadabilityScore(),
//                            response.getMetrics().getPosTagCounts(),
//                            response.getMetrics().getSentimentDistribution(),
//                            response.getMetrics().getEntityTypeCounts(),
//                            response.getMetrics().getSemanticDensity()
//                    );
//
//            SemanticAnalysisHistory history = new SemanticAnalysisHistory(
//                    userId, response.getOriginalText(), response.getTokens(),
//                    response.getSentences(), response.getPosTags(), response.getLemmas(),
//                    response.getNamedEntities(), response.getSentiment(),
//                    historyMetrics, response.getComplexityScore()
//            );
//
//            repository.save(history);
//        } catch (Exception e) {
//            log.error("Error saving semantic analysis history: ", e);
//        }
//    }
//
//    // History management methods
//    public List<SemanticAnalysisHistory> getUserSemanticHistory(String userId) {
//        return repository.findByUserIdOrderByAnalyzedAtDesc(userId);
//    }
//
//    public Page<SemanticAnalysisHistory> getUserSemanticHistory(String userId, Pageable pageable) {
//        return repository.findByUserIdOrderByAnalyzedAtDesc(userId, pageable);
//    }
//
//    public Optional<SemanticAnalysisHistory> getSemanticAnalysisById(String id) {
//        return repository.findById(id);
//    }
//
//    public Map<String, Object> getUserSemanticStats(String userId) {
//        List<SemanticAnalysisHistory> history = repository.findByUserIdOrderByAnalyzedAtDesc(userId);
//        if (history.isEmpty()) {
//            return Map.of("totalAnalyses", 0L, "averageComplexityScore", 0.0);
//        }
//        double averageComplexity = history.stream()
//                .mapToInt(SemanticAnalysisHistory::getComplexityScore).average().orElse(0.0);
//        return Map.of(
//                "totalAnalyses", (long) history.size(),
//                "averageComplexityScore", Math.round(averageComplexity * 100.0) / 100.0,
//                "totalWordsAnalyzed", history.stream().mapToInt(h -> h.getMetrics().getWordCount()).sum()
//        );
//    }
//
//    public Map<String, Object> getDetailedUserStats(String userId) {
//        List<SemanticAnalysisHistory> history = repository.findByUserIdOrderByAnalyzedAtDesc(userId);
//        if (history.isEmpty()) {
//            return Map.of("error", "No analysis history found for user");
//        }
//
//        Map<String, Long> entityTypeTotals = new HashMap<>();
//        Map<String, Long> posTagTotals = new HashMap<>();
//
//        for (SemanticAnalysisHistory analysis : history) {
//            if (analysis.getMetrics().getEntityTypeCounts() != null) {
//                analysis.getMetrics().getEntityTypeCounts().forEach((k, v) ->
//                        entityTypeTotals.merge(k, (long) v, Long::sum));
//            }
//            if (analysis.getMetrics().getPosTagCounts() != null) {
//                analysis.getMetrics().getPosTagCounts().forEach((k, v) ->
//                        posTagTotals.merge(k, (long) v, Long::sum));
//            }
//        }
//
//        return Map.of(
//                "totalAnalyses", (long) history.size(),
//                "topEntityTypes", entityTypeTotals.entrySet().stream()
//                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
//                        .limit(5).collect(Collectors.toMap(
//                                Map.Entry::getKey, Map.Entry::getValue)),
//                "topPOSTags", posTagTotals.entrySet().stream()
//                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
//                        .limit(5).collect(Collectors.toMap(
//                                Map.Entry::getKey, Map.Entry::getValue))
//        );
//    }
//
//    public Map<String, Object> getAnalysisTrends(String userId) {
//        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
//        List<SemanticAnalysisHistory> recentHistory = repository.findRecentAnalysesByUserId(userId, thirtyDaysAgo);
//
//        if (recentHistory.isEmpty()) {
//            return Map.of("message", "No recent analyses in the last 30 days.");
//        }
//
//        Map<String, List<SemanticAnalysisHistory>> groupedByDay = recentHistory.stream()
//                .collect(Collectors.groupingBy(h -> h.getAnalyzedAt().toLocalDate().toString()));
//
//        Map<String, Map<String, Double>> dailyTrends = groupedByDay.entrySet().stream()
//                .collect(Collectors.toMap(
//                        Map.Entry::getKey,
//                        e -> Map.of(
//                                "avgComplexity", e.getValue().stream()
//                                        .mapToInt(SemanticAnalysisHistory::getComplexityScore)
//                                        .average().orElse(0.0),
//                                "avgLexicalDiversity", e.getValue().stream()
//                                        .mapToDouble(h -> h.getMetrics().getLexicalDiversity())
//                                        .average().orElse(0.0),
//                                "analysisCount", (double) e.getValue().size()
//                        )
//                ));
//
//        return Map.of(
//                "recentAnalysisCount", recentHistory.size(),
//                "dailyTrends", new TreeMap<>(dailyTrends),
//                "topComplexAnalyses", repository.findTop10ByUserIdOrderByComplexityScoreDescAnalyzedAtDesc(userId)
//        );
//    }
//}
