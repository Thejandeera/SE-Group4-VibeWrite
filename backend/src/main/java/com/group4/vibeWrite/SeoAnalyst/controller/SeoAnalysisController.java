package com.group4.vibeWrite.SeoAnalyst.controller;

import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysisRequest;
import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysis;
import com.group4.vibeWrite.SeoAnalyst.repository.SeoAnalysisRepository;
import com.group4.vibeWrite.SeoAnalyst.service.SeoAnalyzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/analyze")
public class SeoAnalysisController {

    @Autowired
    private SeoAnalyzerService seoAnalyzerService;

    @Autowired
    private SeoAnalysisRepository seoAnalysisRepository;

    @PostMapping("/seo")
    public ResponseEntity<SeoAnalysis> analyzeSeo(@RequestBody SeoAnalysisRequest request) {

        // Check cache first
        Optional<SeoAnalysis> cachedResult = seoAnalysisRepository.findById(request.getDocumentId());
        if (cachedResult.isPresent()) {
            // Return cached result
            return ResponseEntity.ok(cachedResult.get());
        }

        // Perform analysis
        SeoAnalysis result = seoAnalyzerService.analyze(request);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}