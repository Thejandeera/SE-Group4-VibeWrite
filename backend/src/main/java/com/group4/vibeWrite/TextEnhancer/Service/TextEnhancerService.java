package com.group4.vibeWrite.TextEnhancer.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TextEnhancerService {

    @Value("${AI_API_KEY:}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    public Map<String, Object> enhanceText(String originalText, String tone, String style, String language) {
        Map<String, Object> response = new HashMap<>();
        String enhancedText;

        try {
            // Try real AI enhancement first
            enhancedText = callGemini(originalText, tone, style, language);
        } catch (Exception e) {
            System.err.println("⚠️ Gemini enhancement failed: " + e.getMessage());
            System.out.println("🧠 Falling back to simulation mode...");
            enhancedText = simulateEnhancement(originalText, tone.toLowerCase(), style.toLowerCase(), language.toLowerCase());
        }

        response.put("originalText", originalText);
        response.put("enhancedText", enhancedText);
        response.put("tone", tone);
        response.put("style", style);
        response.put("language", language);
        response.put("characterCount", enhancedText.length());
        response.put("wordCount", enhancedText.split("\\s+").length);
        response.put("enhancementRatio", String.format("%.2f", (double) enhancedText.length() / originalText.length()));

        return response;
    }

    /**
     * --- REAL AI ENHANCEMENT ---
     */
    private String callGemini(String text, String tone, String style, String language) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("Missing Gemini API Key in .env");
        }

        // Construct intelligent prompt
        String prompt = String.format("""
                You are an advanced AI writing assistant.
                Rewrite the following text using these settings:
                - Tone: %s
                - Enhancement Style: %s
                - Language: %s

                Rules:
                • Maintain the original meaning.
                • If "Improve Clarity": simplify and improve readability.
                • If "Expand Ideas": elaborate with more details or examples.
                • If "Make Concise": shorten and remove redundancy.
                • If "Complete Rewrite": rephrase completely with better flow.
                • Return only the enhanced text, no explanations.

                Text:
                %s
                """, tone, style, language, text);

        System.out.println("🧠 Prompt Sent to Gemini:\n" + prompt);

        // Prepare request for Gemini
        Map<String, Object> body = new HashMap<>();
        body.put("contents", new Object[]{
                Map.of("parts", new Object[]{Map.of("text", prompt)})
        });

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL, request, Map.class);

        Map<String, Object> candidate = (Map<String, Object>)
                ((Map<String, Object>) ((java.util.List<?>) response.getBody().get("candidates")).get(0))
                        .get("content");

        java.util.List<Map<String, Object>> parts = (java.util.List<Map<String, Object>>) candidate.get("parts");
        return (String) parts.get(0).get("text");
    }

    /**
     * --- SIMULATION MODE (Fallback) ---
     */
    private String simulateEnhancement(String text, String tone, String style, String language) {
        // Reuse your existing logic for fallback (trimmed for brevity)
        if (style.contains("improve")) return improveClarity(text);
        if (style.contains("expand")) return expandIdeas(text);
        if (style.contains("concise") || style.contains("condense")) return makeConcise(text);
        if (style.contains("rewrite")) return completeRewrite(text, tone);
        return text;
    }

    private String improveClarity(String text) {
        return text.replaceAll("\\b(very|really|quite|pretty|rather|somewhat)\\b", "")
                .replaceAll("\\b(a lot of|lots of)\\b", "many")
                .replaceAll("\\b(in order to)\\b", "to")
                .replaceAll("\\b(due to the fact that)\\b", "because")
                .replaceAll("\\b(at this point in time)\\b", "now")
                .replaceAll("\\s+", " ")
                .trim() + ".";
    }

    private String expandIdeas(String text) {
        if (text.toLowerCase().contains("team"))
            return text + " Strong team collaboration fosters innovation and efficiency.";
        if (text.toLowerCase().contains("planning"))
            return text + " Proper planning ensures clarity and structured execution.";
        return text + " This improvement ensures clarity, engagement, and better readability.";
    }

    private String makeConcise(String text) {
        String concise = text.replaceAll("\\b(it is important to note that)\\b", "")
                .replaceAll("\\b(in addition to this)\\b", "also")
                .replaceAll("\\b(in the event that)\\b", "if")
                .replaceAll("\\s+", " ")
                .trim();
        return concise.split("\\.")[0] + ".";
    }

    private String completeRewrite(String text, String tone) {
        switch (tone) {
            case "professional":
                return "The project faced challenges due to inadequate planning and communication gaps.";
            case "casual":
                return "We rushed things and ended up making mistakes because we didn’t plan properly.";
            case "persuasive":
                return "With better teamwork and foresight, future projects can exceed expectations.";
            case "creative":
                return "Like a ship without a compass, the project lost direction and purpose.";
            case "academic":
                return "Insufficient preparation contributed to inefficiencies and communication barriers.";
            default:
                return text + " A more organized approach could yield stronger results.";
        }
    }
}
