package com.group4.vibeWrite.SeoAnalyst.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TfIdfService {

    // Common English stop words
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "and", "or", "but", "is", "was", "were", "are", "in", "on", "at", "for", "with", "as", "by", "of", "to", "from"
    ));

    public List<String> extractKeywords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return Collections.emptyList();
        }

        // Clean and tokenize the text
        List<String> words = Arrays.stream(text.toLowerCase().split("\\s+"))
                .map(word -> word.replaceAll("[^a-z]", ""))
                .filter(word -> word.length() > 2 && !STOP_WORDS.contains(word))
                .toList();

        // Calculate term frequency
        Map<String, Long> wordCount = words.stream()
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        // Sort by frequency to get top keywords (simplified TF-IDF)
        return wordCount.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .limit(5) // Get top 5 keywords
                .collect(Collectors.toList());
    }
}