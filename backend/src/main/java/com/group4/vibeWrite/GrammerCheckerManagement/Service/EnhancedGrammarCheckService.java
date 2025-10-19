package com.group4.vibeWrite.GrammerCheckerManagement.Service;

import com.group4.vibeWrite.GrammerCheckerManagement.Config.GrammarScoringProperties;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckRequest;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckResponse;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarError;
import com.group4.vibeWrite.GrammerCheckerManagement.Entity.GrammarCheckHistory;
import com.group4.vibeWrite.GrammerCheckerManagement.Repository.GrammarCheckRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.languagetool.JLanguageTool;
import org.languagetool.rules.RuleMatch;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
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

    // Injected dependencies
    private final GrammarCheckRepository grammarCheckRepository;
    private final JLanguageTool languageTool; // Singleton bean from GrammarConfig
    private final GrammarScoringProperties scoringProperties; // Type-safe configuration

    @Value("${grammar.custom-rules.ap-style-over}")
    private String apStyleOverRule;

    private final Map<String, String> styleGuideRules = new HashMap<>();

    @PostConstruct
    public void init() {
        // Initialize any custom rules from configuration
        initializeStyleGuideRules();
        log.info("Enhanced Grammar Check Service initialized with custom rules.");
    }

    private void initializeStyleGuideRules() {
        // AP Style rule loaded from application.properties
        styleGuideRules.put(apStyleOverRule, "AP Style: Use 'more than' with numbers");
    }

    @Cacheable(value = "grammarChecks", key = "#request.text")
    public GrammarCheckResponse checkGrammar(GrammarCheckRequest request, String userId) {
        log.info("Processing grammar check for text length: {}", request.getText().length());
        try {
            String originalText = request.getText().trim();

            if (originalText.isEmpty()) {
                throw new IllegalArgumentException("Text cannot be empty");
            }

            List<GrammarError> errors = new ArrayList<>();

            // Use LanguageTool for comprehensive grammar checking
            errors.addAll(checkWithLanguageTool(originalText));

            // Check for any custom style guide compliance
            errors.addAll(checkStyleGuide(originalText));

            // Remove duplicate errors and sort by position
            errors = deduplicateAndSortErrors(errors);

            // Apply corrections
            String correctedText = applyCorrections(originalText, errors);

            // Calculate comprehensive metrics
            GrammarCheckResponse.GrammarMetrics metrics = calculateAdvancedMetrics(originalText, errors);

            // Calculate sophisticated grammar score using external configuration
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

            // Save to history if userId provided
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
                List<String> suggestions = match.getSuggestedReplacements();
                String suggestedText = suggestions.isEmpty() ? "" : suggestions.get(0);

                errors.add(new GrammarError(
                        match.getFromPos(),
                        match.getToPos(),
                        categorizeLanguageToolError(match),
                        text.substring(match.getFromPos(), match.getToPos()),
                        suggestedText,
                        match.getMessage(),
                        determineSeverity(match)
                ));
            }
        } catch (IOException e) {
            log.warn("LanguageTool check failed: ", e);
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

    private String categorizeLanguageToolError(RuleMatch match) {
        String categoryName = match.getRule().getCategory().getName();
        if (categoryName.contains("GRAMMAR")) return "GRAMMAR";
        if (categoryName.contains("PUNCTUATION")) return "PUNCTUATION";
        if (categoryName.contains("STYLE")) return "STYLE";
        if (categoryName.contains("SPELLING")) return "SPELLING";
        return "OTHER";
    }

    private String determineSeverity(RuleMatch match) {
        if (match.getRule().getCategory().getName().contains("GRAMMAR")) return "HIGH";
        if (match.getRule().getCategory().getName().contains("PUNCTUATION")) return "MEDIUM";
        return "LOW";
    }

    private List<GrammarError> deduplicateAndSortErrors(List<GrammarError> errors) {
        Set<String> seen = new HashSet<>();
        List<GrammarError> deduplicated = new ArrayList<>();
        for (GrammarError error : errors) {
            String key = error.getStartPosition() + "-" + error.getEndPosition();
            if (seen.add(key)) {
                deduplicated.add(error);
            }
        }
        deduplicated.sort(Comparator.comparingInt(GrammarError::getStartPosition));
        return deduplicated;
    }

    private String applyCorrections(String originalText, List<GrammarError> errors) {
        StringBuilder corrected = new StringBuilder(originalText);
        List<GrammarError> sortedErrors = errors.stream()
                .filter(e -> e.getSuggestedText() != null && !e.getSuggestedText().isEmpty())
                .sorted(Comparator.comparingInt(GrammarError::getStartPosition).reversed())
                .collect(Collectors.toList());

        for (GrammarError error : sortedErrors) {
            corrected.replace(error.getStartPosition(), error.getEndPosition(), error.getSuggestedText());
        }
        return corrected.toString();
    }

    private GrammarCheckResponse.GrammarMetrics calculateAdvancedMetrics(String text, List<GrammarError> errors) {
        GrammarCheckResponse.GrammarMetrics metrics = new GrammarCheckResponse.GrammarMetrics();
        String[] words = text.trim().split("\\s+");
        metrics.setWordCount(words.length);
        metrics.setSentenceCount(Math.max(1, text.split("[.!?]+").length));

        metrics.setSpellingErrors((int) errors.stream().filter(e -> "SPELLING".equals(e.getErrorType())).count());
        metrics.setGrammarErrors((int) errors.stream().filter(e -> "GRAMMAR".equals(e.getErrorType())).count());
        metrics.setPunctuationErrors((int) errors.stream().filter(e -> "PUNCTUATION".equals(e.getErrorType())).count());
        metrics.setStyleIssues((int) errors.stream().filter(e -> "STYLE".equals(e.getErrorType())).count());

        double avgWordsPerSentence = (double) metrics.getWordCount() / metrics.getSentenceCount();
        double avgSyllablesPerWord = calculateAverageSyllables(words);
        double fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        metrics.setReadabilityScore(Math.max(0, Math.min(100, fleschScore)));

        return metrics;
    }

    private double calculateAverageSyllables(String[] words) {
        int totalSyllables = 0;
        for (String word : words) {
            totalSyllables += countSyllables(word);
        }
        return words.length > 0 ? (double) totalSyllables / words.length : 0;
    }

    private int countSyllables(String word) {
        word = word.toLowerCase().replaceAll("[^a-z]", "");
        if (word.length() == 0) return 0;
        int syllables = 0;
        boolean previousWasVowel = false;
        for (char c : word.toCharArray()) {
            boolean isVowel = "aeiouy".indexOf(c) != -1;
            if (isVowel && !previousWasVowel) {
                syllables++;
            }
            previousWasVowel = isVowel;
        }
        if (word.endsWith("e") && syllables > 1) {
            syllables--;
        }
        return Math.max(1, syllables);
    }

    private int calculateAdvancedGrammarScore(String text, List<GrammarError> errors, GrammarCheckResponse.GrammarMetrics metrics) {
        int baseScore = scoringProperties.getBaseScore();
        int wordCount = Math.max(1, metrics.getWordCount());

        // Weighted error deduction from properties
        for (GrammarError error : errors) {
            switch (error.getSeverity()) {
                case "HIGH": baseScore -= scoringProperties.getDeduction().getHigh(); break;
                case "MEDIUM": baseScore -= scoringProperties.getDeduction().getMedium(); break;
                case "LOW": baseScore -= scoringProperties.getDeduction().getLow(); break;
                default: baseScore -= scoringProperties.getDeduction().getDefaultValue(); break;
            }
        }

        // Error density penalty from properties
        double errorRate = (double) errors.size() / wordCount;
        if (errorRate > scoringProperties.getPenalty().getErrorDensityHighThreshold()) {
            baseScore -= scoringProperties.getPenalty().getErrorDensityHighAmount();
        } else if (errorRate > scoringProperties.getPenalty().getErrorDensityMediumThreshold()) {
            baseScore -= scoringProperties.getPenalty().getErrorDensityMediumAmount();
        } else if (errorRate > scoringProperties.getPenalty().getErrorDensityLowThreshold()) {
            baseScore -= scoringProperties.getPenalty().getErrorDensityLowAmount();
        }

        // Readability bonus/penalty from properties
        double readabilityScore = metrics.getReadabilityScore();
        if (readabilityScore > scoringProperties.getBonus().getReadabilityHighThreshold()) {
            baseScore += scoringProperties.getBonus().getReadabilityHighAmount();
        } else if (readabilityScore > scoringProperties.getBonus().getReadabilityMediumThreshold()) {
            baseScore += scoringProperties.getBonus().getReadabilityMediumAmount();
        } else if (readabilityScore < scoringProperties.getPenalty().getReadabilityThreshold()) {
            baseScore -= scoringProperties.getPenalty().getReadabilityAmount();
        }

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

    // Methods for history management and analytics
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
        return grammarCheckRepository.findAverageScoreByUserId(userId).orElse(0.0);
    }
}