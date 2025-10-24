package com.group4.vibeWrite.GrammerCheckerManagement.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarError {
    private int startPosition;
    private int endPosition;
    private String errorType;
    private String originalText;
    private String suggestedText;
    private String description;
    private String severity; // LOW, MEDIUM, HIGH
}
