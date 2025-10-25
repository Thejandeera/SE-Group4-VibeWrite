package com.group4.vibeWrite.SeoAnalyst.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Setter
@Getter
@Document(collection = "SeoAnalysis")
public class SeoAnalysis {

    @Id
    private String documentId;
    private String userId;  // Added userId field
    private String content; // Raw content analyzed
    private double score;
    private List<Keyword> keywords; // Top keywords
    private String metaDescription;
    private List<String> recommendations;

    // Optional fields populated by frontend AI analysis
    private Integer wordCount;
    private String sentimentLabel;      // e.g., POSITIVE/NEUTRAL/NEGATIVE
    private Double sentimentScore;      // optional numeric score
    private Double readabilityScore;    // e.g., FK score or similar
    private Map<String, Double> keywordDensity;  // term -> percentage or score
    private Map<String, Double> performanceMetrics; // arbitrary metrics used by charts
    private List<String> aiSuggestions; // AI suggestions shown on UI
    private String source;              // "server" or "client_ai"
}