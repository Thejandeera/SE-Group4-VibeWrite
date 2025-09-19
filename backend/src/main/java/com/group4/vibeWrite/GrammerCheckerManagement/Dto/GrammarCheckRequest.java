package com.group4.vibeWrite.GrammerCheckerManagement.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarCheckRequest {

    private String userId;

    @NotBlank(message = "Text cannot be empty")
    @Size(max = 10000, message = "Text cannot exceed 10000 characters")
    private String text;

    private String language = "en"; // Default to English
}