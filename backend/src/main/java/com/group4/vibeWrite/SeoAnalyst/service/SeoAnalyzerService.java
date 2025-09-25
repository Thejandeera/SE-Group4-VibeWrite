package com.group4.vibeWrite.SeoAnalyst.service;

import com.group4.vibeWrite.SeoAnalyst.model.Keyword;
import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysis;
import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysisRequest;
import com.group4.vibeWrite.SeoAnalyst.repository.SeoAnalysisRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SeoAnalyzerService {

    private final SeoAnalysisRepository seoAnalysisRepository;

    // Common English stop words
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "in", "on", "at", "and", "or", "to", "for", "with", "about",
            "your", "by", "is", "of", "from", "into", "as", "that", "this", "it", "its",
            "i", "we", "you", "he", "she", "they", "them", "their", "our", "my", "your",
            "his", "her", "can", "will", "be", "have", "do", "would", "should"
    ));

    public SeoAnalyzerService(SeoAnalysisRepository seoAnalysisRepository) {
        this.seoAnalysisRepository = seoAnalysisRepository;
    }

    public SeoAnalysis analyze(SeoAnalysisRequest request) {
        String content = request.getContent();

        // 1. Keyword Extraction (TF-IDF)
        Map<String, Double> keywordScores = getTfIdfScores(content);
        List<Keyword> keywords = new ArrayList<>();
        keywordScores.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(5)
                .forEach(entry -> keywords.add(new Keyword(entry.getKey(), entry.getValue())));

        // 2. Meta Description Generation (first 2 sentences)
        String metaDescription = generateMetaDescription(content, keywordScores);

        // 3. Build final analysis object
        SeoAnalysis analysis = new SeoAnalysis();
        analysis.setDocumentId(request.getDocumentId());
        analysis.setContent(content);
        analysis.setKeywords(keywords);
        analysis.setMetaDescription(metaDescription);
        analysis.setScore(calculateSeoScore(keywords, metaDescription));
        analysis.setRecommendations(generateRecommendations(analysis));

        return seoAnalysisRepository.save(analysis);
    }

    private Map<String, Double> getTfIdfScores(String content) {
        Map<String, Double> tfScores = calculateTf(content);
        List<SeoAnalysis> allAnalyses = seoAnalysisRepository.findAll();
        long totalDocuments = allAnalyses.size();

        // If not enough documents exist for meaningful IDF, return TF scores directly.
        if (totalDocuments == 0) {
            return tfScores;
        }

        Map<String, Double> idfScores = calculateIdf(tfScores.keySet(), allAnalyses);
        Map<String, Double> tfidfScores = new HashMap<>();

        for (String term : tfScores.keySet()) {
            double tfidf = tfScores.get(term) * idfScores.getOrDefault(term, 0.0);
            tfidfScores.put(term, tfidf);
        }
        return tfidfScores;
    }

    private Map<String, Double> calculateTf(String content) {
        Map<String, Double> tfScores = new HashMap<>();
        String[] tokens = content.toLowerCase().split("\\s+");

        List<String> cleanedTokens = Arrays.stream(tokens)
                .map(token -> token.replaceAll("[^a-zA-Z]", "")) // Remove punctuation
                .filter(token -> !token.isEmpty())
                .filter(token -> !STOP_WORDS.contains(token))
                .collect(Collectors.toList());

        long totalCleanedWords = cleanedTokens.size();
        if (totalCleanedWords == 0) return tfScores;

        Set<String> uniqueWords = new HashSet<>(cleanedTokens);
        for (String word : uniqueWords) {
            long count = cleanedTokens.stream().filter(word::equals).count();
            tfScores.put(word, (double) count / totalCleanedWords);
        }
        return tfScores;
    }

    private Map<String, Double> calculateIdf(Set<String> terms, List<SeoAnalysis> allAnalyses) {
        Map<String, Double> idfScores = new HashMap<>();
        long totalDocuments = allAnalyses.size();

        for (String term : terms) {
            long documentsWithTerm = allAnalyses.stream()
                    .filter(analysis -> analysis.getContent() != null && analysis.getContent().toLowerCase().contains(term))
                    .count();
            double idf = Math.log((double) totalDocuments / (documentsWithTerm + 1));
            idfScores.put(term, idf);
        }
        return idfScores;
    }

    private String generateMetaDescription(String content, Map<String, Double> keywordScores) {
        // Split content into sentences using punctuation
        String[] sentences = content.split("(?<=[.!?])\\s+");

        Map<String, Double> sentenceScores = new HashMap<>();
        for (String sentence : sentences) {
            double score = Arrays.stream(sentence.toLowerCase().split("\\s+"))
                    .mapToDouble(word -> keywordScores.getOrDefault(word.replaceAll("[^a-zA-Z]", ""), 0.0))
                    .sum();
            sentenceScores.put(sentence, score);
        }

        List<String> sortedSentences = sentenceScores.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        StringBuilder summary = new StringBuilder();
        int maxLength = 160;
        for (String sentence : sortedSentences) {
            if (summary.length() + sentence.length() <= maxLength) {
                summary.append(sentence).append(" ");
            } else {
                break;
            }
        }
        return summary.toString().trim();
    }

    private double calculateSeoScore(List<Keyword> keywords, String metaDescription) {
        double keywordScore = 0;
        if (!keywords.isEmpty()) {
            double averageKeywordScore = keywords.stream().mapToDouble(Keyword::getScore).sum() / keywords.size();
            keywordScore = averageKeywordScore * 50; // Scale keyword importance
        }

        double metaDescriptionScore = 0;
        int metaDescLength = metaDescription.length();
        if (metaDescLength >= 50 && metaDescLength <= 160) metaDescriptionScore = 50;
        else if (metaDescLength > 160) metaDescriptionScore = 25;

        boolean metaDescHasKeyword = keywords.stream()
                .anyMatch(keyword -> metaDescription.toLowerCase().contains(keyword.getTerm().toLowerCase()));
        if (metaDescHasKeyword) metaDescriptionScore += 10;

        return Math.min(100, keywordScore + metaDescriptionScore);
    }

    private List<String> generateRecommendations(SeoAnalysis analysis) {
        List<String> recommendations = new ArrayList<>();

        if (analysis.getMetaDescription().length() < 50)
            recommendations.add("Increase the length of your meta description for better click-through rates.");
        else if (analysis.getMetaDescription().length() > 160)
            recommendations.add("Shorten your meta description to avoid truncation in search results.");

        boolean metaDescHasKeyword = analysis.getKeywords().stream()
                .anyMatch(keyword -> analysis.getMetaDescription().toLowerCase().contains(keyword.getTerm().toLowerCase()));
        if (!metaDescHasKeyword)
            recommendations.add("Consider including one of your top keywords in the meta description.");

        if (analysis.getContent().length() < 500)
            recommendations.add("Your content seems short. Aim for more in-depth content to improve authority.");

        long totalWords = Arrays.stream(analysis.getContent().split("\\s+")).count();
        double topKeywordDensity = analysis.getKeywords().stream()
                .mapToDouble(keyword -> (double) Collections.frequency(Arrays.asList(analysis.getContent().toLowerCase().split("\\s+")),
                        keyword.getTerm().toLowerCase()) / totalWords)
                .sum();
        if (topKeywordDensity > 0.03)
            recommendations.add("Be careful of keyword stuffing. Your top keywords have a high density.");

        return recommendations;
    }
}
