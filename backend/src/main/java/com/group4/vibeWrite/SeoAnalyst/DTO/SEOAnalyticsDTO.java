package com.group4.vibeWrite.SeoAnalyst.DTO;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;


@Getter
@Setter
public class SEOAnalyticsDTO {
    private String documentId;
    private String content;

    //values computed on the frontend (using AI)
    private Double SeoScore;
    private Double readabilityScore;
    private Integer wordCount;
    private String sentimentLabel;   //POSITIVE/NEUTRAL/NEGATIVE
    private Map<String, Double> keywordDensity;
    private Map<String, Double> performanceMetrics; // SEO Performance chart metrics
    private List<String> aiSuggestions;             // suggestions from AI
    private List<String> recommendations;           // improvement recommendations
    private String metaDescription;                 // optional if AI generated one
}
