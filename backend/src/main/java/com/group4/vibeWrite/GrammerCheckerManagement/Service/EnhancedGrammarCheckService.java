package com.group4.vibeWrite.GrammerCheckerManagement.Service;


import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckResponse;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckRequest;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarError;
import com.group4.vibeWrite.GrammerCheckerManagement.Entity.GrammarCheckHistory;
import com.group4.vibeWrite.GrammerCheckerManagement.Repository.GrammarCheckRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.languagetool.JLanguageTool;
import org.languagetool.language.AmericanEnglish;
import org.languagetool.rules.CategoryId;
import org.languagetool.rules.RuleMatch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnhancedGrammarCheckService {

    private final GrammarCheckRepository grammarCheckRepository;

    private JLanguageTool languageTool;
    //private final LevenshteinDistance levenshteinDistance = new LevenshteinDistance();

    // Advanced grammar patterns
    private final Map<String, String> advancedPatterns = new HashMap<>();
    //private final Set<String> commonWords = new HashSet<>();
    private final Map<String, String> styleGuideRules = new HashMap<>();

    @PostConstruct
    public void init() {
        try {
            // Initialize LanguageTool
            languageTool = new JLanguageTool(new AmericanEnglish());

            // Enable specific rule categories
            languageTool.enableRuleCategory(new CategoryId("GRAMMAR"));
            languageTool.enableRuleCategory(new CategoryId("PUNCTUATION"));
            languageTool.enableRuleCategory(new CategoryId("TYPOGRAPHY"));
            languageTool.enableRuleCategory(new CategoryId("STYLE"));

            initializeAdvancedPatterns();
            initializeCommonWords();
            initializeStyleGuideRules();

            log.info("Enhanced Grammar Check Service initialized successfully");

        } catch (Exception e) {
            log.error("Error initializing Enhanced Grammar Check Service: ", e);
            throw new RuntimeException("Failed to initialize grammar service", e);
        }
    }


    @PreDestroy
    public void cleanup() {
        if (languageTool != null) {
            languageTool = null;
        }
    }

    private void initializeAdvancedPatterns() {
        // Subject-verb agreement patterns
        advancedPatterns.put("\\b(he|she|it)\\s+(are|were)\\b", "Subject-verb disagreement");
        advancedPatterns.put("\\b(they|we|you)\\s+(is|was)\\b", "Subject-verb disagreement");

        // Common confusion patterns
        advancedPatterns.put("\\bthen\\s+(\\w+ing|\\w+ed)\\b", "Consider 'than' for comparisons");
        advancedPatterns.put("\\baffect\\s+on\\b", "Use 'effect' as noun, 'affect' as verb");
        advancedPatterns.put("\\bcould\\s+care\\s+less\\b", "Did you mean 'couldn't care less'?");

        // Redundancy patterns
        advancedPatterns.put("\\b(very|really|extremely)\\s+(very|really|extremely)\\b", "Avoid double intensifiers");
        advancedPatterns.put("\\b(more|most)\\s+\\w+er\\b", "Avoid double comparatives");
        advancedPatterns.put("\\b(more|most)\\s+\\w+est\\b", "Avoid double superlatives");
    }

    private void initializeCommonWords() {
        String[] words = {
                "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for",
                "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his",
                "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my",
                "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
                "about", "who", "get", "which", "go", "me", "when", "make", "can", "like",
                "time", "no", "just", "him", "know", "take", "people", "into", "year",
                "your", "good", "some", "could", "them", "see", "other", "than", "then",
                "now", "look", "only", "come", "its", "over", "think", "also", "back",
                "after", "use", "two", "how", "our", "work", "first", "well", "way",
                "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
        };
        commonWords.addAll(Arrays.asList(words));
    }

    private void initializeStyleGuideRules() {
        // AP Style and common writing guidelines
        styleGuideRules.put("\\bover\\s+\\d+\\b", "AP Style: Use 'more than' with numbers");
        styleGuideRules.put("\\b(alot|alright)\\b", "Use 'a lot' and 'all right'");
        styleGuideRules.put("\\bthat\\s+which\\b", "Use 'that' for restrictive clauses");
        styleGuideRules.put("\\bwhich\\s+[^,]", "Use comma before 'which' in non-restrictive clauses");
        styleGuideRules.put("\\bwho's\\s+\\w+\\b", "Use 'whose' for possession");
    }

    public GrammarCheckResponse checkGrammar(GrammarCheckRequest request, String userId) {
        try {
            String originalText = request.getText().trim();

            if (originalText.isEmpty()) {
                throw new IllegalArgumentException("Text cannot be empty");
            }

            List<GrammarError> errors = new ArrayList<>();

            // Use LanguageTool for comprehensive grammar checking
            errors.addAll(checkWithLanguageTool(originalText));

            // Add custom pattern checks
            errors.addAll(checkCustomPatterns(originalText));

            // Check style guide compliance
            errors.addAll(checkStyleGuide(originalText));

            // Check readability issues
            errors.addAll(checkReadability(originalText));

            // Remove duplicate errors and sort by position
            errors = deduplicateAndSortErrors(errors);

            // Apply corrections
            String correctedText = applyCorrections(originalText, errors);

            // Calculate comprehensive metrics
            GrammarCheckResponse.GrammarMetrics metrics = calculateAdvancedMetrics(originalText, errors);

            // Calculate sophisticated grammar score
            int grammarScore = calculateAdvancedGrammarScore(originalText, errors, metrics);

            // Create response
            GrammarCheckResponse response = new GrammarCheckResponse();
            response.setOriginalText(originalText);
            response.setCorrectedText(correctedText);
            response.setGrammarScore(grammarScore);
            response.setTotalErrors(errors.size());
            response.setErrors(errors);
            response.setMetrics(metrics);
            response.setCheckedAt(LocalDateTime.now());

            // ✅ Save to history if userId provided in body
            if (userId != null && !userId.trim().isEmpty()) {
                saveToHistory(response, userId);
            }

            log.info("Grammar check completed: Score={}, Errors={}, Text length={}",
                    grammarScore, errors.size(), originalText.length());

            return response;

        } catch (Exception e) {
            log.error("Error in enhanced grammar checking: ", e);
            throw new RuntimeException("Failed to check grammar", e);
        }
    }


    private List<GrammarError> checkWithLanguageTool(String text) {
        List<GrammarError> errors = new ArrayList<>();

        try {
            List<RuleMatch> matches = languageTool.check(text);

            for (RuleMatch match : matches) {
                String errorType = categorizeLanguageToolError(match);
                String severity = determineSeverity(match);

                List<String> suggestions = match.getSuggestedReplacements();
                String suggestedText = suggestions.isEmpty() ? "" : suggestions.get(0);

                GrammarError error = new GrammarError(
                        match.getFromPos(),
                        match.getToPos(),
                        errorType,
                        text.substring(match.getFromPos(), match.getToPos()),
                        suggestedText,
                        match.getMessage(),
                        severity
                );

                errors.add(error);
            }

        } catch (IOException e) {
            log.warn("LanguageTool check failed, falling back to basic checks: ", e);
        }

        return errors;
    }

    private String categorizeLanguageToolError(RuleMatch match) {
        String ruleId = match.getRule().getId();
        String category = match.getRule().getCategory().getName();

        if (category.contains("GRAMMAR") || ruleId.contains("AGREEMENT")) {
            return "GRAMMAR";
        } else if (category.contains("PUNCTUATION") || category.contains("TYPOGRAPHY")) {
            return "PUNCTUATION";
        } else if (category.contains("STYLE") || ruleId.contains("STYLE")) {
            return "STYLE";
        } else if (ruleId.contains("SPELL") || category.contains("SPELL")) {
            return "SPELLING";
        } else {
            return "OTHER";
        }
    }

    private String determineSeverity(RuleMatch match) {
        String ruleId = match.getRule().getId();

        // High severity: Grammar and agreement errors
        if (ruleId.contains("AGREEMENT") || ruleId.contains("WRONG_VERB") ||
                ruleId.contains("SUBJECT_VERB") || match.getRule().getCategory().getName().equals("GRAMMAR")) {
            return "HIGH";
        }

        // Medium severity: Punctuation and common errors
        if (match.getRule().getCategory().getName().equals("PUNCTUATION") ||
                ruleId.contains("COMMA") || ruleId.contains("APOSTROPHE")) {
            return "MEDIUM";
        }

        // Low severity: Style and minor issues
        return "LOW";
    }

    private List<GrammarError> checkCustomPatterns(String text) {
        List<GrammarError> errors = new ArrayList<>();

        for (Map.Entry<String, String> pattern : advancedPatterns.entrySet()) {
            Pattern regex = Pattern.compile(pattern.getKey(), Pattern.CASE_INSENSITIVE);
            Matcher matcher = regex.matcher(text);

            while (matcher.find()) {
                errors.add(new GrammarError(
                        matcher.start(),
                        matcher.end(),
                        "GRAMMAR",
                        matcher.group(),
                        "", // No automatic suggestion for complex patterns
                        pattern.getValue(),
                        "HIGH"
                ));
            }
        }

        return errors;
    }

    private List<GrammarError> checkStyleGuide(String text) {
        List<GrammarError> errors = new ArrayList<>();

        for (Map.Entry<String, String> rule : styleGuideRules.entrySet()) {
            Pattern pattern = Pattern.compile(rule.getKey(), Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);

            while (matcher.find()) {
                errors.add(new GrammarError(
                        matcher.start(),
                        matcher.end(),
                        "STYLE",
                        matcher.group(),
                        "",
                        rule.getValue(),
                        "LOW"
                ));
            }
        }

        return errors;
    }

    private List<GrammarError> checkReadability(String text) {
        List<GrammarError> errors = new ArrayList<>();

        // Check for overly long sentences
        String[] sentences = text.split("[.!?]+");
        int position = 0;

        for (String sentence : sentences) {
            sentence = sentence.trim();
            if (!sentence.isEmpty()) {
                String[] words = sentence.split("\\s+");

                if (words.length > 25) {
                    int start = text.indexOf(sentence, position);
                    errors.add(new GrammarError(
                            start,
                            start + sentence.length(),
                            "STYLE",
                            sentence,
                            "",
                            "Consider breaking this long sentence (contains " + words.length + " words)",
                            "LOW"
                    ));
                }

                position = text.indexOf(sentence, position) + sentence.length();
            }
        }

        // Check for passive voice overuse
        Pattern passivePattern = Pattern.compile("\\b(is|are|was|were|being|been)\\s+(\\w+ed|\\w+en)\\b",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = passivePattern.matcher(text);

        while (matcher.find()) {
            errors.add(new GrammarError(
                    matcher.start(),
                    matcher.end(),
                    "STYLE",
                    matcher.group(),
                    "",
                    "Consider using active voice for clearer writing",
                    "LOW"
            ));
        }

        return errors;
    }

    private List<GrammarError> deduplicateAndSortErrors(List<GrammarError> errors) {
        // Remove duplicates based on position and type
        Set<String> seen = new HashSet<>();
        List<GrammarError> deduplicated = new ArrayList<>();

        for (GrammarError error : errors) {
            String key = error.getStartPosition() + "-" + error.getEndPosition() + "-" + error.getErrorType();
            if (!seen.contains(key)) {
                seen.add(key);
                deduplicated.add(error);
            }
        }

        // Sort by position
        deduplicated.sort(Comparator.comparingInt(GrammarError::getStartPosition));

        return deduplicated;
    }

    private String applyCorrections(String originalText, List<GrammarError> errors) {
        String corrected = originalText;

        // Apply corrections from end to beginning to avoid position shifts
        List<GrammarError> applicableErrors = errors.stream()
                .filter(error -> error.getSuggestedText() != null &&
                        !error.getSuggestedText().isEmpty() &&
                        error.getStartPosition() >= 0 &&
                        error.getEndPosition() <= originalText.length())
                .sorted((a, b) -> Integer.compare(b.getStartPosition(), a.getStartPosition()))
                .collect(Collectors.toList());

        for (GrammarError error : applicableErrors) {
            try {
                if (error.getEndPosition() <= corrected.length()) {
                    corrected = corrected.substring(0, error.getStartPosition()) +
                            error.getSuggestedText() +
                            corrected.substring(error.getEndPosition());
                }
            } catch (Exception e) {
                log.warn("Error applying correction at position {}-{}: {}",
                        error.getStartPosition(), error.getEndPosition(), e.getMessage());
            }
        }

        return corrected;
    }

    private GrammarCheckResponse.GrammarMetrics calculateAdvancedMetrics(String text, List<GrammarError> errors) {
        GrammarCheckResponse.GrammarMetrics metrics = new GrammarCheckResponse.GrammarMetrics();

        // Basic counts
        String[] words = text.trim().split("\\s+");
        String[] sentences = text.split("[.!?]+");

        metrics.setWordCount(words.length);
        metrics.setSentenceCount(Math.max(1, sentences.length));

        // Error categorization
        metrics.setSpellingErrors((int) errors.stream().filter(e -> "SPELLING".equals(e.getErrorType())).count());
        metrics.setGrammarErrors((int) errors.stream().filter(e -> "GRAMMAR".equals(e.getErrorType())).count());
        metrics.setPunctuationErrors((int) errors.stream().filter(e -> "PUNCTUATION".equals(e.getErrorType())).count());
        metrics.setStyleIssues((int) errors.stream().filter(e -> "STYLE".equals(e.getErrorType())).count());

        // Advanced readability calculation (Flesch-Kincaid)
        double avgWordsPerSentence = (double) metrics.getWordCount() / metrics.getSentenceCount();
        double avgSyllablesPerWord = calculateAverageSyllables(words);

        // Flesch Reading Ease Score
        double fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        metrics.setReadabilityScore(Math.max(0, Math.min(100, fleschScore)));

        return metrics;
    }

    private double calculateAverageSyllables(String[] words) {
        int totalSyllables = 0;
        int validWords = 0;

        for (String word : words) {
            String cleanWord = word.toLowerCase().replaceAll("[^a-z]", "");
            if (cleanWord.length() > 0) {
                totalSyllables += countSyllables(cleanWord);
                validWords++;
            }
        }

        return validWords > 0 ? (double) totalSyllables / validWords : 1.0;
    }

    private int countSyllables(String word) {
        if (word.length() == 0) return 0;

        word = word.toLowerCase();
        int syllables = 0;
        boolean previousWasVowel = false;

        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            boolean isVowel = "aeiouy".indexOf(c) != -1;

            if (isVowel && !previousWasVowel) {
                syllables++;
            }
            previousWasVowel = isVowel;
        }

        // Handle silent 'e'
        if (word.endsWith("e") && syllables > 1) {
            syllables--;
        }

        // Handle 'le' endings
        if (word.endsWith("le") && word.length() > 2 &&
                "bcdfghjklmnpqrstvwxz".indexOf(word.charAt(word.length() - 3)) != -1) {
            syllables++;
        }

        return Math.max(1, syllables);
    }

    private int calculateAdvancedGrammarScore(String text, List<GrammarError> errors,
                                              GrammarCheckResponse.GrammarMetrics metrics) {

        int baseScore = 100;
        int wordCount = Math.max(1, metrics.getWordCount());

        // Weighted error deduction
        for (GrammarError error : errors) {
            switch (error.getSeverity()) {
                case "HIGH":
                    baseScore -= 8;
                    break;
                case "MEDIUM":
                    baseScore -= 4;
                    break;
                case "LOW":
                    baseScore -= 2;
                    break;
                default:
                    baseScore -= 1;
                    break;
            }
        }

        // Error density penalty
        double errorRate = (double) errors.size() / wordCount;
        if (errorRate > 0.05) baseScore -= 5;  // More than 5% error rate
        if (errorRate > 0.10) baseScore -= 10; // More than 10% error rate
        if (errorRate > 0.20) baseScore -= 20; // More than 20% error rate

        // Grammar-specific penalties
        int grammarErrors = metrics.getGrammarErrors();
        if (grammarErrors > 0) {
            baseScore -= Math.min(15, grammarErrors * 3); // Cap grammar penalty
        }

        // Readability bonus/penalty
        double readabilityScore = metrics.getReadabilityScore();
        if (readabilityScore > 80) baseScore += 5;      // Very readable
        else if (readabilityScore > 60) baseScore += 3; // Good readability
        else if (readabilityScore < 30) baseScore -= 5; // Poor readability

        // Length consideration (longer texts are harder to get perfect)
        if (wordCount > 100) {
            double lengthFactor = Math.min(1.2, 1.0 + (wordCount - 100) / 1000.0);
            baseScore = (int) (baseScore * lengthFactor);
        }

        // Vocabulary diversity bonus
        Set<String> uniqueWords = new HashSet<>(Arrays.asList(text.toLowerCase().split("\\W+")));
        double vocabularyRatio = (double) uniqueWords.size() / wordCount;
        if (vocabularyRatio > 0.7) baseScore += 3;  // High vocabulary diversity
        else if (vocabularyRatio < 0.4) baseScore -= 2; // Low vocabulary diversity

        return Math.max(0, Math.min(100, baseScore));
    }

    private void saveToHistory(GrammarCheckResponse response, String userId) {
        try {
            List<GrammarCheckHistory.ErrorDetail> errorDetails = response.getErrors().stream()
                    .map(error -> new GrammarCheckHistory.ErrorDetail(
                            error.getStartPosition(), error.getEndPosition(), error.getErrorType(),
                            error.getOriginalText(), error.getSuggestedText(),
                            error.getDescription(), error.getSeverity()
                    ))
                    .collect(Collectors.toList());

            GrammarCheckHistory.Metrics historyMetrics = new GrammarCheckHistory.Metrics(
                    response.getMetrics().getWordCount(),
                    response.getMetrics().getSentenceCount(),
                    response.getMetrics().getSpellingErrors(),
                    response.getMetrics().getGrammarErrors(),
                    response.getMetrics().getPunctuationErrors(),
                    response.getMetrics().getStyleIssues(),
                    response.getMetrics().getReadabilityScore()
            );

            GrammarCheckHistory history = new GrammarCheckHistory(
                    userId, response.getOriginalText(), response.getCorrectedText(),
                    response.getGrammarScore(), response.getTotalErrors(),
                    errorDetails, historyMetrics
            );

            grammarCheckRepository.save(history);

        } catch (Exception e) {
            log.error("Error saving grammar check history: ", e);
        }
    }

    // Additional service methods for history management and analytics

    public List<GrammarCheckHistory> getUserGrammarHistory(String userId) {
        return grammarCheckRepository.findByUserIdOrderByCheckedAtDesc(userId);
    }

    public Page<GrammarCheckHistory> getUserGrammarHistory(String userId, Pageable pageable) {
        return grammarCheckRepository.findByUserIdOrderByCheckedAtDesc(userId, pageable);
    }

    public Optional<GrammarCheckHistory> getGrammarCheckById(String id) {
        return grammarCheckRepository.findById(id);
    }

    public long getUserGrammarCheckCount(String userId) {
        return grammarCheckRepository.countByUserId(userId);
    }

    public double getUserAverageGrammarScore(String userId) {
        List<GrammarCheckHistory> history = grammarCheckRepository.findByUserIdForAverageCalculation(userId);
        return history.stream()
                .mapToInt(GrammarCheckHistory::getGrammarScore)
                .average()
                .orElse(0.0);
    }

    public Map<String, Object> getUserGrammarStats(String userId) {
        List<GrammarCheckHistory> history = grammarCheckRepository.findByUserIdOrderByCheckedAtDesc(userId);

        if (history.isEmpty()) {
            return Map.of(
                    "totalChecks", 0L,
                    "averageScore", 0.0,
                    "mostCommonErrors", Collections.emptyList(),
                    "improvementTrend", "insufficient_data"
            );
        }

        long totalChecks = history.size();
        double averageScore = history.stream()
                .mapToInt(GrammarCheckHistory::getGrammarScore)
                .average()
                .orElse(0.0);

        // Calculate most common error types
        Map<String, Long> errorTypeCounts = history.stream()
                .flatMap(h -> h.getErrors().stream())
                .collect(Collectors.groupingBy(
                        GrammarCheckHistory.ErrorDetail::getErrorType,
                        Collectors.counting()
                ));

        List<Map<String, Object>> mostCommonErrors = errorTypeCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(3)
                .map(entry -> Map.<String, Object>of(
                        "errorType", entry.getKey(),
                        "count", entry.getValue()
                ))
                .collect(Collectors.toList());

        // Calculate improvement trend (last 5 vs previous 5)
        String improvementTrend = calculateImprovementTrend(history);

        return Map.of(
                "totalChecks", totalChecks,
                "averageScore", Math.round(averageScore * 100.0) / 100.0,
                "mostCommonErrors", mostCommonErrors,
                "improvementTrend", improvementTrend,
                "totalWords", history.stream().mapToInt(h -> h.getMetrics().getWordCount()).sum(),
                "averageReadability", history.stream()
                        .mapToDouble(h -> h.getMetrics().getReadabilityScore())
                        .average()
                        .orElse(0.0)
        );
    }

    private String calculateImprovementTrend(List<GrammarCheckHistory> history) {
        if (history.size() < 6) {
            return "insufficient_data";
        }

        // Get last 5 and previous 5 scores
        List<Integer> recent = history.stream()
                .limit(5)
                .map(GrammarCheckHistory::getGrammarScore)
                .collect(Collectors.toList());

        List<Integer> previous = history.stream()
                .skip(5)
                .limit(5)
                .map(GrammarCheckHistory::getGrammarScore)
                .collect(Collectors.toList());

        if (previous.size() < 5) {
            return "insufficient_data";
        }

        double recentAvg = recent.stream().mapToInt(Integer::intValue).average().orElse(0);
        double previousAvg = previous.stream().mapToInt(Integer::intValue).average().orElse(0);

        double improvement = recentAvg - previousAvg;

        if (improvement > 5) return "improving";
        else if (improvement < -5) return "declining";
        else return "stable";
    }

    public List<GrammarError> getQuickSuggestions(String text) {
        try {
            // Quick check for immediate feedback (lighter version)
            List<GrammarError> quickErrors = new ArrayList<>();

            // Basic spelling check
            quickErrors.addAll(checkBasicSpelling(text));

            // Common grammar patterns
            quickErrors.addAll(checkCommonGrammarIssues(text));

            // Basic punctuation
            quickErrors.addAll(checkBasicPunctuation(text));

            return quickErrors.stream()
                    .limit(10) // Limit for quick response
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error in quick grammar suggestions: ", e);
            return Collections.emptyList();
        }
    }

    private List<GrammarError> checkBasicSpelling(String text) {
        List<GrammarError> errors = new ArrayList<>();
        Map<String, String> quickSpellCheck = Map.of(
                "teh", "the",
                "adn", "and",
                "recieve", "receive",
                "seperate", "separate",
                "definately", "definitely"
        );

        for (Map.Entry<String, String> correction : quickSpellCheck.entrySet()) {
            Pattern pattern = Pattern.compile("\\b" + correction.getKey() + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);

            while (matcher.find()) {
                errors.add(new GrammarError(
                        matcher.start(), matcher.end(), "SPELLING",
                        matcher.group(), correction.getValue(),
                        "Spelling correction", "MEDIUM"
                ));
            }
        }

        return errors;
    }

    private List<GrammarError> checkCommonGrammarIssues(String text) {
        List<GrammarError> errors = new ArrayList<>();

        // Its vs It's
        Pattern itsPattern = Pattern.compile("\\bits\\s+[a-z]", Pattern.CASE_INSENSITIVE);
        Matcher itsMatcher = itsPattern.matcher(text);
        while (itsMatcher.find()) {
            if (!text.substring(itsMatcher.start(), itsMatcher.end()).contains("'")) {
                errors.add(new GrammarError(
                        itsMatcher.start(), itsMatcher.start() + 3, "GRAMMAR",
                        "its", "it's", "Consider 'it's' (it is)", "MEDIUM"
                ));
            }
        }

        // Your vs You're
        Pattern yourPattern = Pattern.compile("\\byour\\s+(welcome|going|coming)", Pattern.CASE_INSENSITIVE);
        Matcher yourMatcher = yourPattern.matcher(text);
        while (yourMatcher.find()) {
            errors.add(new GrammarError(
                    yourMatcher.start(), yourMatcher.start() + 4, "GRAMMAR",
                    "your", "you're", "Use 'you're' (you are)", "MEDIUM"
            ));
        }

        return errors;
    }

    private List<GrammarError> checkBasicPunctuation(String text) {
        List<GrammarError> errors = new ArrayList<>();

        // Double spaces
        Pattern doubleSpace = Pattern.compile("\\s{2,}");
        Matcher spaceMatcher = doubleSpace.matcher(text);
        while (spaceMatcher.find()) {
            errors.add(new GrammarError(
                    spaceMatcher.start(), spaceMatcher.end(), "PUNCTUATION",
                    spaceMatcher.group(), " ", "Extra spaces", "LOW"
            ));
        }

        return errors;
    }
}