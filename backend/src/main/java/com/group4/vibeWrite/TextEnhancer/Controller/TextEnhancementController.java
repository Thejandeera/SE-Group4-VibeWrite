package com.group4.vibeWrite.TextEnhancer.Controller;

import com.group4.vibeWrite.TextEnhancer.DTO.TextEnhancementRequestDTO;
import com.group4.vibeWrite.TextEnhancer.DTO.TextEnhancementResponseDTO;
import com.group4.vibeWrite.TextEnhancer.Service.TextEnhancementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/text-enhancements")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TextEnhancementController {

    private final TextEnhancementService textEnhancementService;

    @PostMapping
    public ResponseEntity<TextEnhancementResponseDTO> saveTextEnhancement(
            @Valid @RequestBody TextEnhancementRequestDTO requestDTO) {
        log.info("POST /api/text-enhancements - Saving text enhancement for user: {}", requestDTO.getUserId());

        TextEnhancementResponseDTO response = textEnhancementService.saveTextEnhancement(requestDTO);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TextEnhancementResponseDTO>> getAllTextEnhancements() {
        log.info("GET /api/text-enhancements - Fetching all text enhancements");

        List<TextEnhancementResponseDTO> response = textEnhancementService.getAllTextEnhancements();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TextEnhancementResponseDTO>> getTextEnhancementsByUserId(
            @PathVariable String userId) {
        log.info("GET /api/text-enhancements/user/{} - Fetching text enhancements for user", userId);

        List<TextEnhancementResponseDTO> response = textEnhancementService.getTextEnhancementsByUserId(userId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}