package com.group4.vibeWrite.TextEnhancer.Service;


import com.group4.vibeWrite.TextEnhancer.DTO.TextEnhancementRequestDTO;
import com.group4.vibeWrite.TextEnhancer.DTO.TextEnhancementResponseDTO;
import com.group4.vibeWrite.TextEnhancer.Entity.TextEnhancement;
import com.group4.vibeWrite.TextEnhancer.Repository.TextEnhancementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TextEnhancementService {

    private final TextEnhancementRepository textEnhancementRepository;

    public TextEnhancementResponseDTO saveTextEnhancement(TextEnhancementRequestDTO requestDTO) {
        log.info("Saving text enhancement for user: {}", requestDTO.getUserId());

        TextEnhancement textEnhancement = TextEnhancement.builder()
                .userId(requestDTO.getUserId())
                .normalText(requestDTO.getNormalText())
                .enhancedText(requestDTO.getEnhancedText())
                .option(requestDTO.getOption())
                .timestamp(LocalDateTime.now())
                .build();

        TextEnhancement savedEnhancement = textEnhancementRepository.save(textEnhancement);
        log.info("Text enhancement saved with ID: {}", savedEnhancement.getId());

        return mapToResponseDTO(savedEnhancement);
    }

    public List<TextEnhancementResponseDTO> getAllTextEnhancements() {
        log.info("Fetching all text enhancements");

        List<TextEnhancement> enhancements = textEnhancementRepository.findAllByOrderByTimestampDesc();

        return enhancements.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TextEnhancementResponseDTO> getTextEnhancementsByUserId(String userId) {
        log.info("Fetching text enhancements for user: {}", userId);

        List<TextEnhancement> enhancements = textEnhancementRepository.findByUserIdOrderByTimestampDesc(userId);

        return enhancements.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private TextEnhancementResponseDTO mapToResponseDTO(TextEnhancement textEnhancement) {
        return TextEnhancementResponseDTO.builder()
                .id(textEnhancement.getId())
                .userId(textEnhancement.getUserId())
                .normalText(textEnhancement.getNormalText())
                .enhancedText(textEnhancement.getEnhancedText())
                .option(textEnhancement.getOption())
                .timestamp(textEnhancement.getTimestamp())
                .build();
    }
}