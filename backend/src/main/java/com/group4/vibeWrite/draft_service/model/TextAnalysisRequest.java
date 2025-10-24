package com.group4.vibeWrite.draft_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TextAnalysisRequest {

    @NotBlank(message = "Text cannot be blank")
    @Size(min = 10, message = "Text must be at least 10 characters long")
    private String text;

    public TextAnalysisRequest() {}

    public TextAnalysisRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
