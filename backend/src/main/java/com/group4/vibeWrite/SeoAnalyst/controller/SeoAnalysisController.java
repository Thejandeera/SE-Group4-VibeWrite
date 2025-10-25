package com.group4.vibeWrite.SeoAnalyst.controller;

import com.group4.vibeWrite.SeoAnalyst.DTO.SEOAnalyticsDTO;
import com.group4.vibeWrite.SeoAnalyst.model.Keyword;
import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysis;
import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysisRequest;
import com.group4.vibeWrite.SeoAnalyst.repository.SeoAnalysisRepository;
import com.group4.vibeWrite.SeoAnalyst.service.SeoAnalyzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analyze")
public class SeoAnalysisController {

    @Autowired
    private SeoAnalyzerService seoAnalyzerService;

    @Autowired
    private SeoAnalysisRepository seoAnalysisRepository;

    // Server-side analysis with optional cache bypass
    @PostMapping("/seo")
    public ResponseEntity<SeoAnalysis> analyzeSeo(@RequestBody SeoAnalysisRequest request,
                                                  @RequestParam(name = "force", defaultValue = "false") boolean force) {
        if (request.getDocumentId() == null || request.getDocumentId().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (request.getUserId() == null || request.getUserId().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (!force) {
            Optional<SeoAnalysis> cachedResult = seoAnalysisRepository.findById(request.getDocumentId());
            if (cachedResult.isPresent()) {
                return ResponseEntity.ok(cachedResult.get());
            }
        }

        SeoAnalysis result = seoAnalyzerService.analyze(request);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // Ingest precomputed SEO analysis from the frontend (Gemini/AI output)
    @PostMapping("/seo/client")
    public ResponseEntity<SeoAnalysis> ingestClientSeo(@RequestBody SEOAnalyticsDTO dto) {
        if (dto.getDocumentId() == null || dto.getDocumentId().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (dto.getUserId() == null || dto.getUserId().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        SeoAnalysis analysis = seoAnalysisRepository.findById(dto.getDocumentId()).orElse(new SeoAnalysis());
        analysis.setDocumentId(dto.getDocumentId());
        analysis.setUserId(dto.getUserId());  // Set userId from DTO
        analysis.setContent(dto.getContent());
        analysis.setScore(dto.getSeoScore() != null ? dto.getSeoScore() : 0.0);
        analysis.setMetaDescription(dto.getMetaDescription());
        analysis.setRecommendations(dto.getRecommendations());

        // Map keyword density (term -> value) to top Keywords list
        if (dto.getKeywordDensity() != null && !dto.getKeywordDensity().isEmpty()) {
            List<Keyword> topKeywords = dto.getKeywordDensity().entrySet().stream()
                    .sorted(Map.Entry.<String, Double>comparingByValue(Comparator.reverseOrder()))
                    .limit(5)
                    .map(e -> new Keyword(e.getKey(), e.getValue()))
                    .collect(Collectors.toList());
            analysis.setKeywords(topKeywords);
        }

        // Extended fields
        analysis.setWordCount(dto.getWordCount());
        analysis.setReadabilityScore(dto.getReadabilityScore());
        analysis.setSentimentLabel(dto.getSentimentLabel());
        analysis.setKeywordDensity(dto.getKeywordDensity());
        analysis.setPerformanceMetrics(dto.getPerformanceMetrics());
        analysis.setAiSuggestions(dto.getAiSuggestions());
        analysis.setSource("client_ai");

        SeoAnalysis saved = seoAnalysisRepository.save(analysis);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    // Retrieve a stored analysis by documentId
    @GetMapping("/seo/{documentId}")
    public ResponseEntity<SeoAnalysis> getSeoAnalysis(@PathVariable String documentId) {
        if (documentId == null || documentId.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return seoAnalysisRepository.findById(documentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // NEW: Get all analyses for a specific user
    @GetMapping("/seo/user/{userId}")
    public ResponseEntity<List<SeoAnalysis>> getSeoAnalysesByUserId(@PathVariable String userId) {
        if (userId == null || userId.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<SeoAnalysis> analyses = seoAnalysisRepository.findByUserId(userId);

        if (analyses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(analyses);
    }
}