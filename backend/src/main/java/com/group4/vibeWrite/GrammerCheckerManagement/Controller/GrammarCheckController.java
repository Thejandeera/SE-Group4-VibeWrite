package com.group4.vibeWrite.GrammerCheckerManagement.Controller;

import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckRequest;
import com.group4.vibeWrite.GrammerCheckerManagement.Dto.GrammarCheckResponse;
import com.group4.vibeWrite.GrammerCheckerManagement.Entity.GrammarCheckHistory;
import com.group4.vibeWrite.GrammerCheckerManagement.Service.EnhancedGrammarCheckService;
import com.group4.vibeWrite.GrammerCheckerManagement.Service.GrammarCheckService;
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
@RequestMapping("/api/v1/grammar")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${frontend.url}")
public class GrammarCheckController {

    private final EnhancedGrammarCheckService grammarCheckService;

    @PostMapping("/check")
    public ResponseEntity<GrammarCheckResponse> checkGrammar(
            @Valid @RequestBody GrammarCheckRequest request) {

        try {
            log.info("Grammar check requested for text length: {}", request.getText().length());

            String userId = request.getUserId(); // ✅ Take userId from body

            GrammarCheckResponse response = grammarCheckService.checkGrammar(request, userId);

            log.info("Grammar check completed. Score: {}, Errors: {}",
                    response.getGrammarScore(), response.getTotalErrors());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Invalid grammar check request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error processing grammar check: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/check-anonymous")
    public ResponseEntity<GrammarCheckResponse> checkGrammarAnonymous(
            @Valid @RequestBody GrammarCheckRequest request) {

        try {
            log.info("Anonymous grammar check requested for text length: {}", request.getText().length());

            GrammarCheckResponse response = grammarCheckService.checkGrammar(request, null);

            log.info("Anonymous grammar check completed. Score: {}, Errors: {}",
                    response.getGrammarScore(), response.getTotalErrors());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Invalid anonymous grammar check request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error processing anonymous grammar check: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get full history for a user
    @GetMapping("/history/user/{userId}")
    public ResponseEntity<List<GrammarCheckHistory>> getGrammarHistory(
            @PathVariable String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<GrammarCheckHistory> history = grammarCheckService.getUserGrammarHistory(userId);
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            log.error("Error retrieving grammar history for userId {}: ", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get a specific grammar check by record ID
    @GetMapping("/history/{id}")
    public ResponseEntity<GrammarCheckHistory> getGrammarCheckById(@PathVariable String id) {
        try {
            Optional<GrammarCheckHistory> grammarCheck = grammarCheckService.getGrammarCheckById(id);

            return grammarCheck.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());

        } catch (Exception e) {
            log.error("Error retrieving grammar check by ID: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping("/history/paginated")
    public ResponseEntity<Page<GrammarCheckHistory>> getGrammarHistoryPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String userId = authentication.getName();
            Pageable pageable = PageRequest.of(page, size);
            Page<GrammarCheckHistory> history = grammarCheckService.getUserGrammarHistory(userId, pageable);
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            log.error("Error retrieving paginated grammar history: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    @GetMapping("/history/{id}")
//    public ResponseEntity<GrammarCheckHistory> getGrammarCheckById(
//            @PathVariable String id,
//            Authentication authentication) {
//
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        try {
//            Optional<GrammarCheckHistory> grammarCheck = grammarCheckService.getGrammarCheckById(id);
//
//            if (grammarCheck.isEmpty()) {
//                return ResponseEntity.notFound().build();
//            }
//
//            // Verify the grammar check belongs to the authenticated user
//            String userId = authentication.getName();
//            if (!userId.equals(grammarCheck.get().getUserId())) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//            }
//
//            return ResponseEntity.ok(grammarCheck.get());
//
//        } catch (Exception e) {
//            log.error("Error retrieving grammar check by ID: ", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGrammarStats(
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String userId = authentication.getName();

            long totalChecks = grammarCheckService.getUserGrammarCheckCount(userId);
            double averageScore = grammarCheckService.getUserAverageGrammarScore(userId);

            Map<String, Object> stats = Map.of(
                    "totalChecks", totalChecks,
                    "averageScore", Math.round(averageScore * 100.0) / 100.0,
                    "userId", userId
            );

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            log.error("Error retrieving grammar stats: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Grammar Check Service",
                "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }
}