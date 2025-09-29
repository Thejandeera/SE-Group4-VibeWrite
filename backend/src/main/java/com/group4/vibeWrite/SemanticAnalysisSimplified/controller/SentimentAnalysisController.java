package com.group4.vibeWrite.SemanticAnalysisSimplified.controller;


import com.group4.vibeWrite.SemanticAnalysisSimplified.dto.SentimentRequest;
import com.group4.vibeWrite.SemanticAnalysisSimplified.dto.SentimentResponse;
import com.group4.vibeWrite.SemanticAnalysisSimplified.Service.SentimentAnalysisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sentiment")
@CrossOrigin(origins = "*") // Allows cross-origin requests
public class SentimentAnalysisController {

    private static final Logger log = LoggerFactory.getLogger(SentimentAnalysisController.class);
    private final SentimentAnalysisService sentimentAnalysisService;

    public SentimentAnalysisController(SentimentAnalysisService sentimentAnalysisService) {
        this.sentimentAnalysisService = sentimentAnalysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<SentimentResponse> analyzeSentiment(@Valid @RequestBody SentimentRequest request) {
        try {
            log.info("Sentiment analysis requested for text length: {}", request.getText().length());

            Map<String, String> sentimentResults = sentimentAnalysisService.analyzeSentiment(request.getText());

            // Calculate overall sentiment based on the majority
            String overallSentiment = calculateOverallSentiment(sentimentResults);

            SentimentResponse response = SentimentResponse.builder()
                    .originalText(request.getText())
                    .sentenceSentiments(sentimentResults)
                    .overallSentiment(overallSentiment)
                    .totalSentences(sentimentResults.size())
                    .analyzedAt(LocalDateTime.now())
                    .build();

            log.info("Sentiment analysis completed. Overall sentiment: {}", overallSentiment);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing sentiment analysis: ", e);
            // Return an error response DTO for internal failures
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(SentimentResponse.builder()
                            .originalText(request.getText())
                            .error("Failed to analyze sentiment: " + e.getMessage())
                            .analyzedAt(LocalDateTime.now())
                            .build());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Sentiment Analysis Service",
                "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }

    // Helper method to calculate overall sentiment (Majority rule)
    private String calculateOverallSentiment(Map<String, String> sentimentResults) {
        if (sentimentResults.isEmpty()) {
            return "Neutral";
        }

        Map<String, Integer> sentimentCounts = new HashMap<>();
        sentimentCounts.put("Very positive", 0);
        sentimentCounts.put("Positive", 0);
        sentimentCounts.put("Neutral", 0);
        sentimentCounts.put("Negative", 0);
        sentimentCounts.put("Very negative", 0);

        // Count each sentiment type
        for (String sentiment : sentimentResults.values()) {
            sentimentCounts.put(sentiment, sentimentCounts.getOrDefault(sentiment, 0) + 1);
        }

        // Find the most common sentiment
        String overallSentiment = "Neutral";
        int maxCount = 0;

        for (Map.Entry<String, Integer> entry : sentimentCounts.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                overallSentiment = entry.getKey();
            }
        }
        return overallSentiment;
    }
}