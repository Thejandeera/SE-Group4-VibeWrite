package com.group4.vibeWrite.draft_service.service;

import com.group4.vibeWrite.draft_service.model.ReadabilityResult;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class FleschKincaidService {

    private static final Pattern WORD_PATTERN = Pattern.compile("\\b\\w+\\b");
    private static final Pattern SENTENCE_PATTERN = Pattern.compile("[.!?]+");
    private static final Pattern VOWEL_PATTERN = Pattern.compile("[aeiouAEIOU]");

    public ReadabilityResult analyzeText(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be null or empty");
        }

        text = text.trim();

        int totalWords = countWords(text);
        int totalSentences = countSentences(text);
        int totalSyllables = countSyllables(text);

        if (totalWords == 0 || totalSentences == 0) {
            throw new IllegalArgumentException("Text must contain at least one word and one sentence");
        }

        double averageWordsPerSentence = (double) totalWords / totalSentences;
        double averageSyllablesPerWord = (double) totalSyllables / totalWords;

        // Flesch-Kincaid Grade Level Formula:
        // 0.39 × (average words per sentence) + 11.8 × (average syllables per word) - 15.59
        double fleschKincaidScore = 0.39 * averageWordsPerSentence +
                11.8 * averageSyllablesPerWord - 15.59;

        String gradeLevel = determineGradeLevel(fleschKincaidScore);

        // Round to 2 decimal places
        fleschKincaidScore = Math.round(fleschKincaidScore * 100.0) / 100.0;
        averageWordsPerSentence = Math.round(averageWordsPerSentence * 100.0) / 100.0;
        averageSyllablesPerWord = Math.round(averageSyllablesPerWord * 100.0) / 100.0;

        return new ReadabilityResult(fleschKincaidScore, gradeLevel, totalWords,
                totalSentences, totalSyllables,
                averageWordsPerSentence, averageSyllablesPerWord);
    }

    private int countWords(String text) {
        return (int) WORD_PATTERN.matcher(text).results().count();
    }

    private int countSentences(String text) {
        int count = (int) SENTENCE_PATTERN.matcher(text).results().count();
        return Math.max(count, 1); // At least 1 sentence
    }

    private int countSyllables(String text) {
        String[] words = WORD_PATTERN.matcher(text).results()
                .map(match -> match.group().toLowerCase())
                .toArray(String[]::new);

        int totalSyllables = 0;
        for (String word : words) {
            totalSyllables += countSyllablesInWord(word);
        }
        return Math.max(totalSyllables, 1); // At least 1 syllable
    }

    private int countSyllablesInWord(String word) {
        if (word.length() <= 3) return 1;

        int syllables = 0;
        boolean previousWasVowel = false;

        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            boolean isVowel = VOWEL_PATTERN.matcher(String.valueOf(c)).matches();

            if (isVowel && !previousWasVowel) {
                syllables++;
            }
            previousWasVowel = isVowel;
        }

        // Handle silent 'e' at the end
        if (word.endsWith("e") && syllables > 1) {
            syllables--;
        }

        return Math.max(syllables, 1); // At least 1 syllable per word
    }

    private String determineGradeLevel(double score) {
        if (score < 1) return "Very Simple – Beginner Friendly";
        else if (score <= 3) return "Simple – Easy to Read";
        else if (score <= 6) return "Moderately Simple – Casual Readers";
        else if (score <= 8) return "Intermediate – Engaging Read";
        else if (score <= 12) return "Advanced – Thought-Provoking";
        else if (score <= 16) return "Complex – Professional Level";
        else return "Highly Complex – Professional Level";
    }
}
