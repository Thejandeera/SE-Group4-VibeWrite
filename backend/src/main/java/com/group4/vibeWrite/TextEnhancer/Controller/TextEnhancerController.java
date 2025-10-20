package com.group4.vibeWrite.TextEnhancer.Controller;

import com.group4.vibeWrite.TextEnhancer.Service.TextEnhancerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/text-enhancer")
@CrossOrigin(origins = "${frontend.url}")
public class TextEnhancerController {

    @Autowired
    private TextEnhancerService textEnhancerService;

    @PostMapping("/enhance")
    public ResponseEntity<Map<String, Object>> enhanceText(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            String tone = request.getOrDefault("tone", "Professional");
            String style = request.getOrDefault("style", "Improve Clarity");
            String language = request.getOrDefault("language", "English");

            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Text input is required."));
            }

            Map<String, Object> result = textEnhancerService.enhanceText(text, tone, style, language);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to enhance text: " + e.getMessage()
            ));
        }
    }
}
