package com.group4.vibeWrite.draft_service.controller;


import com.group4.vibeWrite.draft_service.model.ReadabilityResult;
import com.group4.vibeWrite.draft_service.model.TextAnalysisRequest;
import com.group4.vibeWrite.draft_service.service.FleschKincaidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readability")
@CrossOrigin(origins = "http://localhost:3000")
public class ReadabilityController {

    @Autowired
    private FleschKincaidService fleschKincaidService;

    @PostMapping("/analyze")
    public ResponseEntity<ReadabilityResult> analyzeText(@Valid @RequestBody TextAnalysisRequest request) {
        try {
            ReadabilityResult result = fleschKincaidService.analyzeText(request.getText());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Readability service is running!");
    }
}