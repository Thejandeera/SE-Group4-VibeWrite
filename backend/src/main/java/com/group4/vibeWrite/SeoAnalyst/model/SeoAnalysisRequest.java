package com.group4.vibeWrite.SeoAnalyst.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeoAnalysisRequest {
    private String documentId;
    private String content;
    private String userId;  // Added userId field
}