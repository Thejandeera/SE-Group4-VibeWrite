package com.group4.vibeWrite.SemanticAnalysis.controller;

import com.group4.vibeWrite.SemanticAnalysis.dto.SemanticAnalysisRequest;
import com.group4.vibeWrite.SemanticAnalysis.dto.SemanticAnalysisResponse;
import com.group4.vibeWrite.SemanticAnalysis.entity.SemanticAnalysisHistory;
import com.group4.vibeWrite.SemanticAnalysis.service.SemanticAnalysisOrchestrator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/semantic-analysis")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${frontend.url:*}")
public class SemanticAnalysisController {

    private final SemanticAnalysisOrchestrator orchestrator;

    @PostMapping("/analyze")
    public ResponseEntity<SemanticAnalysisResponse> analyzeText(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            log.info("Semantic analysis requested for text length: {}", request.getText().length());
            String userId = request.getUserId();
            SemanticAnalysisResponse response = orchestrator.performCompleteAnalysis(request, userId);
            log.info("Semantic analysis completed. Score: {}", response.getComplexityScore());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid semantic analysis request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error processing semantic analysis: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/analyze-anonymous")
    public ResponseEntity<SemanticAnalysisResponse> analyzeTextAnonymous(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            log.info("Anonymous semantic analysis requested for text length: {}", request.getText().length());
            SemanticAnalysisResponse response = orchestrator.performCompleteAnalysis(request, null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing anonymous semantic analysis: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/tokenize")
    public ResponseEntity<List<String>> tokenize(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            return ResponseEntity.ok(orchestrator.getTokenizeService().tokenizeText(request.getText()));
        } catch (Exception e) {
            log.error("Error in tokenization: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/sentences")
    public ResponseEntity<List<String>> recognizeSentences(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            return ResponseEntity.ok(orchestrator.getSentenceRecognizerService().recognizeSentences(request.getText()));
        } catch (Exception e) {
            log.error("Error in sentence recognition: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/pos")
    public ResponseEntity<Map<String, String>> getPOSTags(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            return ResponseEntity.ok(orchestrator.getPosService().getPOSTags(request.getText()));
        } catch (Exception e) {
            log.error("Error in POS tagging: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/lemma")
    public ResponseEntity<Map<String, String>> lemmatize(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            return ResponseEntity.ok(orchestrator.getLemmaService().lemmatizeText(request.getText()));
        } catch (Exception e) {
            log.error("Error in lemmatization: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/ner")
    public ResponseEntity<Map<String, String>> extractNamedEntities(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            return ResponseEntity.ok(orchestrator.getNerService().extractNamedEntities(request.getText()));
        } catch (Exception e) {
            log.error("Error in NER: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/sentiment")
    public ResponseEntity<Map<String, String>> analyzeSentiment(@Valid @RequestBody SemanticAnalysisRequest request) {
        try {
            return ResponseEntity.ok(orchestrator.getSentimentAnalysisService().analyzeSentiment(request.getText()));
        } catch (Exception e) {
            log.error("Error in sentiment analysis: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/history/user/{userId}")
    public ResponseEntity<List<SemanticAnalysisHistory>> getSemanticHistory(@PathVariable String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            List<SemanticAnalysisHistory> history = orchestrator.getUserSemanticHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error retrieving semantic history for userId {}: ", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<SemanticAnalysisHistory> getSemanticAnalysisById(@PathVariable String id) {
        try {
            Optional<SemanticAnalysisHistory> analysis = orchestrator.getSemanticAnalysisById(id);
            return analysis.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error retrieving semantic analysis by ID: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/history/paginated")
    public ResponseEntity<Page<SemanticAnalysisHistory>> getSemanticHistoryPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String userId = authentication.getName();
            Pageable pageable = PageRequest.of(page, size);
            Page<SemanticAnalysisHistory> history = orchestrator.getUserSemanticHistory(userId, pageable);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error retrieving paginated semantic history: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSemanticStats(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String userId = authentication.getName();
            Map<String, Object> stats = orchestrator.getUserSemanticStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error retrieving semantic stats: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats/detailed")
    public ResponseEntity<Map<String, Object>> getDetailedSemanticStats(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String userId = authentication.getName();
            Map<String, Object> stats = orchestrator.getDetailedUserStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error retrieving detailed semantic stats: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getAnalysisTrends(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String userId = authentication.getName();
            Map<String, Object> trends = orchestrator.getAnalysisTrends(userId);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            log.error("Error retrieving analysis trends: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Semantic Analysis Service",
                "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }
}

