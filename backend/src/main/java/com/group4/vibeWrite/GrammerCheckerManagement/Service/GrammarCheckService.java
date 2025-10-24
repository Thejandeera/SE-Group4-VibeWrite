package com.group4.vibeWrite.GrammerCheckerManagement.Service;


import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckRequest;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckResponse;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarError;
import com.group4.vibeWrite.GrammerCheckerManagement.Entity.GrammarCheckHistory;
import com.group4.vibeWrite.GrammerCheckerManagement.Repository.GrammarCheckRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTaggerME;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GrammarCheckService {

    private final GrammarCheckRepository grammarCheckRepository;

    private SentenceDetectorME sentenceDetector;
    private TokenizerME tokenizer;
    private POSTaggerME posTagger;

    // Common grammar rules and patterns
    private final Map<String, String> commonMisspellings = new HashMap<>();
    private final Map<String, String> grammarRules = new HashMap<>();
    private final Set<String> commonWords = new HashSet<>();

    @PostConstruct
    public void init() {
        try {
            loadOpenNLPModels();
            initializeGrammarRules();
            initializeCommonMisspellings();
            initializeCommonWords();
        } catch (Exception e) {
            log.error("Error initializing grammar service: ", e);
        }
    }

    private void loadOpenNLPModels() {
        try {

            InputStream sentModelStream = getClass().getClassLoader()
                    .getResourceAsStream("models/en-sent.bin");
            if (sentModelStream != null) {
                SentenceModel sentModel = new SentenceModel(sentModelStream);
                sentenceDetector = new SentenceDetectorME(sentModel);
            }

            InputStream tokenModelStream = getClass().getClassLoader()
                    .getResourceAsStream("models/en-token.bin");
            if (tokenModelStream != null) {
                TokenizerModel tokenModel = new TokenizerModel(tokenModelStream);
                tokenizer = new TokenizerME(tokenModel);
            }

            InputStream posModelStream = getClass().getClassLoader()
                    .getResourceAsStream("models/en-pos-maxent.bin");
            if (posModelStream != null) {
                POSModel posModel = new POSModel(posModelStream);
                posTagger = new POSTaggerME(posModel);
            }

        } catch (Exception e) {
            log.warn("OpenNLP models not found, using basic grammar checking: ", e);
        }
    }

    private void initializeGrammarRules() {
        grammarRules.put("\\bthere\\s+is\\s+\\w+s\\b", "Use 'there are' with plural nouns");
        grammarRules.put("\\byour\\s+welcome\\b", "Use 'you're welcome'");
        grammarRules.put("\\bits\\s+not\\s+it's\\b", "Use 'it's' for 'it is'");
        grammarRules.put("\\beffect\\s+on\\b", "Consider using 'affect' as a verb");
        grammarRules.put("\\bwho's\\s+car\\b", "Use 'whose' for possession");
    }

    private void initializeCommonMisspellings() {
        commonMisspellings.put("teh", "the");
        commonMisspellings.put("recieve", "receive");
        commonMisspellings.put("seperate", "separate");
        commonMisspellings.put("definately", "definitely");
        commonMisspellings.put("occured", "occurred");
        commonMisspellings.put("neccessary", "necessary");
        commonMisspellings.put("independant", "independent");
        commonMisspellings.put("existance", "existence");
        commonMisspellings.put("beleive", "believe");
        commonMisspellings.put("acheive", "achieve");
    }

    private void initializeCommonWords() {
        String[] words = {"the", "be", "to", "of", "and", "a", "in", "that", "have",
                "i", "it", "for", "not", "on", "with", "he", "as", "you",
                "do", "at", "this", "but", "his", "by", "from", "they",
                "we", "say", "her", "she", "or", "an", "will", "my",
                "one", "all", "would", "there", "their"};
        commonWords.addAll(Arrays.asList(words));
    }

    public GrammarCheckResponse checkGrammar(GrammarCheckRequest request, String userId) {
        try {
            String originalText = request.getText().trim();
            List<GrammarError> errors = new ArrayList<>();

            // Check spelling
            errors.addAll(checkSpelling(originalText));

            // Check grammar patterns
            errors.addAll(checkGrammarPatterns(originalText));

            // Check punctuation
            errors.addAll(checkPunctuation(originalText));

            // Check sentence structure
            errors.addAll(checkSentenceStructure(originalText));

            // Apply corrections
            String correctedText = applyCorrections(originalText, errors);

            // Calculate metrics
            GrammarCheckResponse.GrammarMetrics metrics = calculateMetrics(originalText, errors);

            // Calculate grammar score
            int grammarScore = calculateGrammarScore(originalText, errors, metrics);

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

            return response;

        } catch (Exception e) {
            log.error("Error checking grammar: ", e);
            throw new RuntimeException("Failed to check grammar", e);
        }
    }

    private List<GrammarError> checkSpelling(String text) {
        List<GrammarError> errors = new ArrayList<>();
        String[] words = text.toLowerCase().split("\\W+");
        int position = 0;

        for (String word : words) {
            if (word.length() > 0) {
                int wordStart = text.toLowerCase().indexOf(word, position);
                int wordEnd = wordStart + word.length();

                if (commonMisspellings.containsKey(word)) {
                    errors.add(new GrammarError(
                            wordStart, wordEnd, "SPELLING",
                            word, commonMisspellings.get(word),
                            "Spelling error detected", "MEDIUM"
                    ));
                }
                position = wordEnd;
            }
        }

        return errors;
    }

    private List<GrammarError> checkGrammarPatterns(String text) {
        List<GrammarError> errors = new ArrayList<>();

        for (Map.Entry<String, String> rule : grammarRules.entrySet()) {
            Pattern pattern = Pattern.compile(rule.getKey(), Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);

            while (matcher.find()) {
                errors.add(new GrammarError(
                        matcher.start(), matcher.end(), "GRAMMAR",
                        matcher.group(), "", rule.getValue(), "HIGH"
                ));
            }
        }

        return errors;
    }

    private List<GrammarError> checkPunctuation(String text) {
        List<GrammarError> errors = new ArrayList<>();

        // Check for double spaces
        Pattern doubleSpace = Pattern.compile("\\s{2,}");
        Matcher matcher = doubleSpace.matcher(text);
        while (matcher.find()) {
            errors.add(new GrammarError(
                    matcher.start(), matcher.end(), "PUNCTUATION",
                    matcher.group(), " ", "Multiple spaces detected", "LOW"
            ));
        }

        // Check for missing spaces after punctuation
        Pattern noSpaceAfterPunct = Pattern.compile("[.!?][a-zA-Z]");
        matcher = noSpaceAfterPunct.matcher(text);
        while (matcher.find()) {
            String original = matcher.group();
            String corrected = original.charAt(0) + " " + original.substring(1);
            errors.add(new GrammarError(
                    matcher.start(), matcher.end(), "PUNCTUATION",
                    original, corrected, "Missing space after punctuation", "MEDIUM"
            ));
        }

        return errors;
    }

    private List<GrammarError> checkSentenceStructure(String text) {
        List<GrammarError> errors = new ArrayList<>();

        if (sentenceDetector != null) {
            String[] sentences = sentenceDetector.sentDetect(text);

            for (String sentence : sentences) {
                // Check sentence length
                if (sentence.split("\\s+").length > 30) {
                    int start = text.indexOf(sentence);
                    errors.add(new GrammarError(
                            start, start + sentence.length(), "STYLE",
                            sentence, "", "Consider breaking this long sentence", "LOW"
                    ));
                }

                // Check if sentence starts with capital letter
                if (!Character.isUpperCase(sentence.trim().charAt(0))) {
                    int start = text.indexOf(sentence);
                    errors.add(new GrammarError(
                            start, start + 1, "PUNCTUATION",
                            String.valueOf(sentence.charAt(0)),
                            String.valueOf(Character.toUpperCase(sentence.charAt(0))),
                            "Sentence should start with capital letter", "MEDIUM"
                    ));
                }
            }
        }

        return errors;
    }

    private String applyCorrections(String originalText, List<GrammarError> errors) {
        String corrected = originalText;

        // Sort errors by position (descending) to avoid position shifts
        List<GrammarError> sortedErrors = errors.stream()
                .filter(error -> error.getSuggestedText() != null && !error.getSuggestedText().isEmpty())
                .sorted((a, b) -> Integer.compare(b.getStartPosition(), a.getStartPosition()))
                .collect(Collectors.toList());

        for (GrammarError error : sortedErrors) {
            try {
                corrected = corrected.substring(0, error.getStartPosition()) +
                        error.getSuggestedText() +
                        corrected.substring(error.getEndPosition());
            } catch (Exception e) {
                log.warn("Error applying correction: ", e);
            }
        }

        return corrected;
    }

    private GrammarCheckResponse.GrammarMetrics calculateMetrics(String text, List<GrammarError> errors) {
        GrammarCheckResponse.GrammarMetrics metrics = new GrammarCheckResponse.GrammarMetrics();

        // Word count
        String[] words = text.split("\\s+");
        metrics.setWordCount(words.length);

        // Sentence count
        if (sentenceDetector != null) {
            String[] sentences = sentenceDetector.sentDetect(text);
            metrics.setSentenceCount(sentences.length);
        } else {
            metrics.setSentenceCount(text.split("[.!?]+").length);
        }

        // Error counts by type
        metrics.setSpellingErrors((int) errors.stream().filter(e -> "SPELLING".equals(e.getErrorType())).count());
        metrics.setGrammarErrors((int) errors.stream().filter(e -> "GRAMMAR".equals(e.getErrorType())).count());
        metrics.setPunctuationErrors((int) errors.stream().filter(e -> "PUNCTUATION".equals(e.getErrorType())).count());
        metrics.setStyleIssues((int) errors.stream().filter(e -> "STYLE".equals(e.getErrorType())).count());

        // Simple readability score (Flesch-like)
        double avgWordsPerSentence = (double) metrics.getWordCount() / Math.max(metrics.getSentenceCount(), 1);
        double avgSyllablesPerWord = calculateAverageSyllables(words);
        double readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        metrics.setReadabilityScore(Math.max(0, Math.min(100, readabilityScore)));

        return metrics;
    }

    private double calculateAverageSyllables(String[] words) {
        int totalSyllables = 0;
        for (String word : words) {
            totalSyllables += countSyllables(word);
        }
        return (double) totalSyllables / Math.max(words.length, 1);
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

        if (word.endsWith("e")) syllables--;

        return Math.max(1, syllables);
    }

    private int calculateGrammarScore(String text, List<GrammarError> errors,
                                      GrammarCheckResponse.GrammarMetrics metrics) {
        if (text.trim().isEmpty()) return 0;

        int baseScore = 100;
        int wordCount = metrics.getWordCount();

        // Deduct points based on errors
        for (GrammarError error : errors) {
            switch (error.getSeverity()) {
                case "HIGH":
                    baseScore -= 5;
                    break;
                case "MEDIUM":
                    baseScore -= 3;
                    break;
                case "LOW":
                    baseScore -= 1;
                    break;
            }
        }

        // Adjust based on error density
        double errorRate = (double) errors.size() / wordCount;
        if (errorRate > 0.1) baseScore -= 10; // More than 10% error rate
        if (errorRate > 0.2) baseScore -= 20; // More than 20% error rate

        // Bonus for good readability
        if (metrics.getReadabilityScore() > 60) baseScore += 5;
        if (metrics.getReadabilityScore() > 80) baseScore += 5;

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

    // Additional service methods for history management

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
}
